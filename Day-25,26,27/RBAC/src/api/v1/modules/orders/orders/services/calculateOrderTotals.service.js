module.exports = function calculateOrderTotals({ items, coupon = null }) {
  let subtotal = 0;
  const itemsWithPricing = [];

  for (const item of items) {
    const variant = item.variant;
    const product = variant ? variant.product : null;

    const unitPrice =
      variant && variant.price !== null && variant.price !== undefined
        ? Number(variant.price)
        : product && product.basePrice !== null && product.basePrice !== undefined
        ? Number(product.basePrice)
        : Number(item.unitPrice || 0);

    const quantity = Number(item.quantity) || 1;
    const lineTotal = unitPrice * quantity;
    subtotal += lineTotal;

    itemsWithPricing.push({
      variantId: variant ? variant.id : item.variantId,
      productName: product ? product.name : (item.productName || 'Product'),
      variantSku: variant ? variant.sku : (item.variantSku || 'SKU'),
      variantAttributes: variant ? variant.attributes : (item.variantAttributes || {}),
      unitPrice,
      quantity,
      lineTotal
    });
  }

  let discountAmount = 0;
  if (coupon) {
    if (coupon.discountType === 'percent') {
      discountAmount = Math.floor((subtotal * Number(coupon.discountValue)) / 100);
      if (coupon.maxDiscountAmount !== null && coupon.maxDiscountAmount !== undefined) {
        discountAmount = Math.min(discountAmount, Number(coupon.maxDiscountAmount));
      }
    } else if (coupon.discountType === 'fixed') {
      discountAmount = Math.min(Number(coupon.discountValue), subtotal);
    }
  }

  const total = subtotal - discountAmount;

  return {
    subtotal,
    discountAmount,
    total,
    itemsWithPricing
  };
};
