import { BadRequestError } from '../../../../middlewares/errorHandler.js';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validates checkout request body payload
 */
export function validateCheckoutPayload(req, res, next) {
  try {
    const { userId, items } = req.body;

    // 1. Validate userId
    if (!userId || typeof userId !== 'string' || !UUID_REGEX.test(userId.trim())) {
      throw new BadRequestError("A valid 'userId' (UUID format) is required.");
    }

    // 2. Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestError("'items' must be a non-empty array of products.");
    }

    // 3. Validate each item in the array
    const productIdsSeen = new Set();

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (!item || typeof item !== 'object') {
        throw new BadRequestError(`Item at index ${i} is invalid.`);
      }

      const { productId, quantity } = item;

      if (!productId || typeof productId !== 'string' || !UUID_REGEX.test(productId.trim())) {
        throw new BadRequestError(`Item at index ${i} must contain a valid 'productId' (UUID format).`);
      }

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new BadRequestError(`Item '${productId}' must have an integer 'quantity' greater than 0.`);
      }

      if (productIdsSeen.has(productId)) {
        throw new BadRequestError(`Duplicate productId '${productId}' detected in checkout payload. Please consolidate quantities.`);
      }

      productIdsSeen.add(productId);
    }

    // Normalize IDs
    req.body.userId = userId.trim();
    req.body.items = items.map((it) => ({
      productId: it.productId.trim(),
      quantity: it.quantity,
    }));

    next();
  } catch (error) {
    next(error);
  }
}
