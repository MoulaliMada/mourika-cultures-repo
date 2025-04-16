const express = require("express");
const router = express.Router();
const adressController = require("../controllers/adressController");

router.post("/add-adress/:customerid", adressController.addAdressByCostomerId);
module.exports = router;
