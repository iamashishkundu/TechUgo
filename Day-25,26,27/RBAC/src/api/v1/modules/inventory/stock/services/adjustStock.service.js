const { sequelize, models } = require('@db');
const ApiError = require('@utils/ApiError');
const notifyAdmins = require('@v1/modules/notifications/services/notifyAdmins.service');

const { ProductVariant, StockMovement } = models;

module.exports = async function adjustStock({
  variantId,
  quantityChange,
  note,
  actorType = 'admin',
  actorId = null
}) {
  let shouldNotifyLowStock = false;
  let sku = '';
  let updatedStock = 0;

  const result = await sequelize.transaction(async (t) => {
    const variant = await ProductVariant.findByPk(variantId, {
      lock: t.LOCK.UPDATE,
      transaction: t
    });

    if (!variant) {
      throw ApiError.notFound('Product variant not found');
    }

    const currentStock = Number(variant.stock) || 0;
    const change = Number(quantityChange);
    const newStock = currentStock + change;

    if (newStock < 0) {
      throw ApiError.badRequest('Insufficient stock: stock cannot go below 0');
    }

    await variant.update({ stock: newStock }, { transaction: t });

    const movement = await StockMovement.create(
      {
        variantId,
        type: 'adjustment',
        quantityChange: change,
        stockAfter: newStock,
        note,
        createdByType: actorType,
        createdById: actorId
      },
      { transaction: t }
    );

    if (change < 0 && newStock <= variant.lowStockThreshold) {
      shouldNotifyLowStock = true;
      sku = variant.sku;
      updatedStock = newStock;
    }

    return {
      variant: await ProductVariant.findByPk(variant.id, { transaction: t }),
      movement
    };
  });

  if (shouldNotifyLowStock) {
    try {
      await notifyAdmins({
        permission: 'inventory:view',
        type: 'low_stock',
        title: 'Low Stock Alert',
        body: `Variant ${sku} has fallen to ${updatedStock} units`,
        data: { variantId, sku, stock: updatedStock }
      });
    } catch {
      // Notification failure shouldn't fail the operation
    }
  }

  return result;
};
