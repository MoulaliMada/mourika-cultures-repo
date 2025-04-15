const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.post("/register", customerController.customerRegister);
router.post("/login", customerController.customerLogin);
router.get("/getcustomer/:customerid", customerController.getCustomerById);
router.post(
  "/:customerid/add-product-cart/:productid",
  customerController.addProductInCartByCustomerId
);
router.post(
  "/:customerid/add-product-wishlist/:productid",
  customerController.addProductInWishlistByCustomerId
);

router.delete(
  "/:customerid/remove-product-wishlist/:productid",
  customerController.removeProductFromWishlistByCustomerId
);

router.delete(
  "/:customerid/remove-product-cart/:productid",
  customerController.removeProductFromCartByCustomerId
);

module.exports = router;
