const Customer = require("../models/Customer");
const Product = require("../models/Product");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");

dotEnv.config();
const secreteKey = process.env.JWT_SECRET;

// customer registration
const customerRegister = async (req, res) => {
  const { customerName, email, phoneNumber, password, isVendor } = req.body;
  try {
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json("user already registerd");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newCustomer = new Customer({
      customerName,
      email,
      phoneNumber,
      password: hashedPassword,
      isVendor,
    });
    await newCustomer.save();
    console.log("registerd");
    return res
      .status(200)
      .json({ message: "customer registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// customer login and generation jwt token
const customerLogin = async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {
    const existingCustomer = await Customer.findOne({ phoneNumber });
    if (!existingCustomer) {
      return res.status(400).json({ message: "customer not registerd" });
    } else if (!(await bcrypt.compare(password, existingCustomer.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        customerId: existingCustomer._id,
        phoneNumber: existingCustomer.phoneNumber,
      },
      secreteKey,
      { expiresIn: "1d" }
    );
    return res.status(200).json({
      message: "login successfully",
      token,
      customer: existingCustomer,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// getting cistomer by id
const getCustomerById = async (req, res) => {
  const customerId = req.params.customerid;
  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(400).json({ message: "customer not found" });
    }
    return res
      .status(200)
      .json({ message: "customer get successfully", customer });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addProductInCartByCustomerId = async (req, res) => {
  const customerId = req.params.customerid;
  const ProductId = req.params.productid;
  try {
    // finding the customer from data base
    const { quantity } = req.body;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(400).json({ message: "customer not found" });
    }
    // finding the product from data base
    const product = await Product.findById(ProductId);
    if (!product) {
      return res.status(400).json({ message: "product not found" });
    }
    // Add the product to the customer's cartList
    const productobj = {
      product: product._id,
      quantity,
    };
    customer.cartList.push(productobj);

    // Save the updated customer
    await customer.save();
    // Re-fetch the customer with populated wishlist and cartList
    const updatedCustomer = await Customer.findById(customerId)
      .populate("wishList")
      .populate("cartList.product");

    const cartList = updatedCustomer.cartList;
    res.status(200).json({
      message: "Product added to cart successfully",
      cartlist: cartList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addProductInWishlistByCustomerId = async (req, res) => {
  const customerId = req.params.customerid;
  const ProductId = req.params.productid;
  try {
    // finding the customer from data base
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(400).json({ message: "customer not found" });
    }
    // finding the product from data base
    const product = await Product.findById(ProductId);
    if (!product) {
      return res.status(400).json({ message: "product not found" });
    }
    // Add the product to the customer's wishlist
    customer.wishList.push(product._id);

    // Save the updated customer
    await customer.save();
    // Re-fetch the customer with populated wishlist and cartList
    const updatedCustomer = await Customer.findById(customerId)
      .populate("wishList")
      .populate("cartList.product");
    const wishList = updatedCustomer.wishList;
    res.status(200).json({
      message: "Product added to wishlist successfully",
      wishlist: wishList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const removeProductFromWishlistByCustomerId = async (req, res) => {
  const customerId = req.params.customerid;
  const productId = req.params.productid;

  try {
    // Find the customer
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(400).json({ message: "Customer not found" });
    }

    // Check if product exists in wishlist
    const index = customer.wishList.indexOf(productId);
    if (index === -1) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    // Remove the product from wishlist
    customer.wishList.splice(index, 1);
    await customer.save();

    // Re-fetch the customer with populated fields
    const updatedCustomer = await Customer.findById(customerId)
      .populate("wishList")
      .populate("cartList.product");
    const wishList = updatedCustomer.wishList;
    res.status(200).json({
      message: "Product removed from wishlist successfully",
      wishlist: wishList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const removeProductFromCartByCustomerId = async (req, res) => {
  const customerId = req.params.customerid;
  const productId = req.params.productid;

  try {
    // Find the customer
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(400).json({ message: "Customer not found" });
    }

    // Check if product exists in cartList
    const cartIndex = customer.cartList.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Remove the product from cartList
    customer.cartList.splice(cartIndex, 1);
    await customer.save();

    // Re-fetch the customer with populated cartList and wishList
    const updatedCustomer = await Customer.findById(customerId)
      .populate("wishList")
      .populate("cartList.product");

    const cartList = updatedCustomer.cartList;
    res.status(200).json({
      message: "Product removed from cart successfully",
      cartList: cartList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  customerRegister,
  customerLogin,
  getCustomerById,
  addProductInCartByCustomerId,
  addProductInWishlistByCustomerId,
  removeProductFromWishlistByCustomerId,
  removeProductFromCartByCustomerId,
};
