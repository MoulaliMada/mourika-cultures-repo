const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");

router.post(
  "/add-address/:customerid",
  addressController.addAddressByCostomerId
);
router.put("/update-address/:addressid", addressController.updateAddressById);
router.delete(
  "/delete-address/:addressid",
  addressController.deleteAddressById
);
module.exports = router;
