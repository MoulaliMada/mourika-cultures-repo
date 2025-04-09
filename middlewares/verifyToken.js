const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Customer = require("../models/Customer");
const Vendor = require("../models/Vendor");

dotenv.config();

const secretKey = process.env.JWT_SECRET;

const verifyCustomerToken = async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    res.status(400).json({ message: "token is required" });
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    const customer = await Customer.findById(decoded.customerId);
    if (!customer) {
      res.status(400).json({ message: "customer not found" });
    }
    req.customerId = customer._id;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

const verifyVendorToken = async (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    res.status(400).json({ message: "token is required" });
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    const vendor = await Vendor.findById(decoded.vendorId);
    if (!vendor) {
      res.status(400).json({ message: "vendor not found" });
    }
    req.vendorId = vendor._id;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};
module.exports = { verifyCustomerToken, verifyVendorToken };
