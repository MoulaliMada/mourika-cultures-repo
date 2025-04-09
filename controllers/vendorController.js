const Vendor = require("../models/Vendor");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();
const secreteKey = process.env.JWT_SECRET;

const vendorRegister = async (req, res) => {
  const { vendorName, email, phoneNumber, password } = req.body;
  try {
    const existingVendorByPhoneNumber = await Vendor.findOne({ phoneNumber });
    // Checking if the vendor already registered
    if (existingVendorByPhoneNumber) {
      return res.status(400).json({ message: "vendor already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newVendor = new Vendor({
      vendorName,
      email,
      phoneNumber,
      password: hashedPassword,
    });
    await newVendor.save();

    res.status(201).json({ message: "Vendor registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const vendorLogin = async (req, res) => {
  const { phoneNumber, password } = req.body;
  try {
    const existingVendor = await Vendor.findOne({ phoneNumber });
    if (!existingVendor) {
      return res.status(400).json({ message: "vendor not found" });
    } else if (!(await bcrypt.compare(password, existingVendor.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      {
        vendorId: existingVendor._id,
        phoneNumber: existingVendor.phoneNumber,
      },
      secreteKey,
      { expiresIn: "1d" }
    );
    
    return res
      .status(200)
      .json({ message: "login successfully", token, vendor: existingVendor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { vendorRegister, vendorLogin };
