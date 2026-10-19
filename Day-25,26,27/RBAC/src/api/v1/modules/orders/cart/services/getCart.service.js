const { models } = require('@db');

const { Cart, CartItem, ProductVariant, Product, ProductImage } = models;

module.exports = async function getCart({ userId }) {
  const [cart] = await Cart.findOrCreate({
    where: { userId },
    defaults: { userId }
  });

  const items = await CartItem.findAll({
    where: { cartId: cart.id },
    include: [
      {
        model: ProductVariant,
        as: 'variant',
        include: [
          {
            model: Product,
            as: 'product',
            include: [{ model: ProductImage, as: 'images' }]
          }
        ]
      }
    ]
  });

  const validItems = [];
  const droppedItems = [];
  let subtotal = 0;

  for (const item of items) {
    const variant = item.variant;
    const product = variant ? variant.product : null;

    if (!variant || !variant.isActive || !product || !product.isActive) {
      await item.destroy();
      droppedItems.push(item.id);
      continue;
    }

    const unitPrice = variant.price !== null && variant.price !== undefined
      ? Number(variant.price)
      : Number(product.basePrice);

    const lineTotal = unitPrice * Number(item.quantity);
    subtotal += lineTotal;

    validItems.push({
      id: item.id,
      variantId: variant.id,
      quantity: item.quantity,
      unitPrice,
      lineTotal,
      variant: {
        id: variant.id,
        sku: variant.sku,
        attributes: variant.attributes,
        price: variant.price,
        inStock: (variant.stock || 0) > 0,
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          basePrice: product.basePrice,
          images: product.images
        }
      }
    });
  }

  return {
    cart: {
      id: cart.id,
      userId: cart.userId,
      couponCode: cart.couponCode
    },
    items: validItems,
    subtotal,
    droppedCount: droppedItems.length,
    message: droppedItems.length > 0 ? `${droppedItems.length} inactive or unavailable item(s) were removed from your cart.` : null
  };
};
