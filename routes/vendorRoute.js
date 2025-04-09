const express = require("express");
const router = express.Router();
const vendorController = require("../controllers/vendorController");

router.post("/register", vendorController.vendorRegister);
module.exports = router;
