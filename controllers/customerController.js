const Customer = require("../models/Customer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotEnv = require("dotenv");

dotEnv.config();
const secreteKey = process.env.JWT_SECRET;

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
    return res
      .status(200)
      .json({ message: "login successfully", token, user: existingCustomer });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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

module.exports = { customerRegister, customerLogin, getCustomerById };
