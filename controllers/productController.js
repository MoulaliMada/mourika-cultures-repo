const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");
const Vendor = require("../models/Vendor");
const multer = require("multer");

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

const updateProduct = async (req, res) => {
  const productId = req.params.productid;

  try {
    const updateData = req.body;
    const image = req.file ? req.file.filename : undefined;

    // Find the product first
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    console.log("prodct finding");
    // If a new image is uploaded and an old image exists, delete old image
    if (image && product.image) {
      const oldImagePath = path.join(__dirname, "..", "uploads", product.image);
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          console.error("Failed to delete old image:", err);
        } else {
          console.log("Old image deleted:", product.image);
        }
      });
    }

    // Update fields only if provided
    Object.keys(updateData).forEach((key) => {
      product[key] = updateData[key];
    });

    // Update image if uploaded
    if (image) {
      product.image = image;
    }
    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Product Update Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getProductById = async (req, res) => {
  const productId = req.params.productid;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      res.status(400).json({ message: "product not found" });
    }

    return res
      .status(200)
      .json({ message: "product found successfully", product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from DB

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    res.status(200).json({
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllProductsByCategory = async (req, res) => {
  const category = req.params.category;
  try {
    //const allProducts = await Product.find();
    // const filterdProducts = allProducts.filter((eachProduct) => {
    //   return eachProduct.category[0] === category;
    // });

    const filteredProducts = await Product.find({ category: category });
    if (filteredProducts.length === 0) {
      res.status(400).json({ message: "there is no more products" });
    }
    res.status(200).json({
      message: "get products successfully",
      products: filteredProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteProductById = async (req, res) => {
  const productId = req.params.productid;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const vendorId = product.vendor;
    // Delete associated image file if exists
    if (product.image) {
      const imagePath = path.join(__dirname, "..", "uploads", product.image);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Error deleting image file:", err);
        } else {
          console.log("Image file deleted:", product.image);
        }
      });
    }

    // Delete product from DB
    await Product.findByIdAndDelete(productId);

    const vendor = await Vendor.findById(vendorId);
    vendor.products = vendor.products.filter(
      (item) => item.toString() !== productId
    );
    await vendor.save();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addProduct: [upload.single("image"), addProduct],
  updateProduct,
  getProductById,
  getAllProducts,
  deleteProductById,
  getAllProductsByCategory,
};
