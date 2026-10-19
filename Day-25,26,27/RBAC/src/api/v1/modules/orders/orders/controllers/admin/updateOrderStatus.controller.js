const asyncHandler = require('@utils/asyncHandler');
const { success } = require('@utils/apiResponse');
const updateOrderStatusService = require('../../services/updateOrderStatus.service');

module.exports = asyncHandler(async (req, res) => {
  const data = await updateOrderStatusService({
    orderId: req.params.orderId,
    status: req.body.status,
    note: req.body.note,
    actorType: req.auth.actorType,
    actorId: req.auth.id
  });
  return success(res, {
    message: 'Order status updated successfully',
    data
  });
});
