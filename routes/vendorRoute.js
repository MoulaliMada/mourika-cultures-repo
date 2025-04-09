const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendorController");

router.post("/register", vendorController.vendorRegister);
router.post("/login", vendorController.vendorLogin);
module.exports = router;
