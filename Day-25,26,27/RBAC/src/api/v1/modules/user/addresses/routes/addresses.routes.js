const router = require('express').Router();
const { authenticate } = require('@middlewares/authenticate');
const validate = require('@middlewares/validate');

const listAddressesController = require('../controllers/listAddresses.controller');
const addAddressController = require('../controllers/addAddress.controller');
const updateAddressController = require('../controllers/updateAddress.controller');
const deleteAddressController = require('../controllers/deleteAddress.controller');
const setDefaultAddressController = require('../controllers/setDefaultAddress.controller');

const addAddressValidation = require('../validations/addAddress.validation');
const updateAddressValidation = require('../validations/updateAddress.validation');

router.get('/', authenticate(['user']), listAddressesController);
router.post('/', authenticate(['user']), validate(addAddressValidation), addAddressController);
router.patch('/:addressId/default', authenticate(['user']), setDefaultAddressController);
router.patch('/:addressId', authenticate(['user']), validate(updateAddressValidation), updateAddressController);
router.delete('/:addressId', authenticate(['user']), deleteAddressController);

module.exports = router;
