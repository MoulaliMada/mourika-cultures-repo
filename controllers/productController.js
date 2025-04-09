const Product = require("../models/Product");
const Vendor = require("../models/Vendor");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cd) {
    cd(null, "./uploads/");
  },
  filename: function (req, file, cd) {
    cd(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
  try {
    const { productName, price, description, packOf, category } = req.body;
    const image = req.file ? req.file.filename : undefined;
    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) {
      res.status(400).json({ message: "vendor not found" });
    }
    const newProduct = new Product({
      productName,
      price,
      description,
      packOf,
      category,
      image,
      vendor: vendor._id,
    });
    const product = await newProduct.save();
    const productId = product._id;
    vendor.products.push(productId);
    await vendor.save();
    return res
      .status(200)
      .json({ message: "product added successfully", product });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "internal server error" });
  }
};

module.exports = { addProduct: [upload.single("image"), addProduct] };
