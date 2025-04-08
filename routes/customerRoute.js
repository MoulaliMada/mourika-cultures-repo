const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.post("/register", customerController.customerRegister);
router.post("/login", customerController.customerLogin);
router.get("/getcustomer/:customerid", customerController.getCustomerById);

module.exports = router;
