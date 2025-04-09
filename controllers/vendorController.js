const Vendor = require("../models/Vendor");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config();

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

module.exports = { vendorRegister };
