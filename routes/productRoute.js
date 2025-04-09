const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const verifingVendorToken = require("../middlewares/verifyToken");

router.post(
  "/add-product",
  verifingVendorToken.verifyVendorToken,
  productController.addProduct
);

router.get("uploads/:imageName", (req, res) => {
  const imageName = req.params.imageName;
  res.headersSent("content-type", "image/jpeg");
  res.sendFile(path.join(__dirname, "..", "uploads", imageName));
});

module.exports = router;
