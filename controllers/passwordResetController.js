const Customer = require("../models/Customer");
const Vendor = require("../models/Vendor");
const Otp = require("../models/otp");
const bcrypt = require("bcryptjs");
const { sendOTP } = require("../utils/sendOtp");

const otpStore = {}; // In-memory store (use Redis in production)

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Step 1: Send OTP
const sendOtpToCustomerPhone = async (req, res) => {
  const { phoneNumber } = req.body;

  const customer = await Customer.findOne({ phoneNumber });
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }

  const generatedOtp = generateOTP();
  //   otpStore[phoneNumber] = generatedOtp;

  const sent = await sendOTP(phoneNumber, generatedOtp);
  const saveOtpModel = new Otp({
    phoneNumber,
    otp: generatedOtp,
  });
  await saveOtpModel.save();
  if (!sent) {
    return res.status(500).json({ message: "Failed to send OTP" });
  }

  res.status(200).json({ message: "OTP sent to your registered phone number" });
};

const sendOtpToVendorPhone = async (req, res) => {
  const { phoneNumber } = req.body;

  const vendor = await Vendor.findOne({ phoneNumber });
  if (!vendor) {
    return res.status(404).json({ message: "vendor not found" });
  }

  const generatedOtp = generateOTP();
  //   otpStore[phoneNumber] = generatedOtp;

  const sent = await sendOTP(phoneNumber, generatedOtp);
  const saveOtpModel = new Otp({
    phoneNumber,
    otp: generatedOtp,
  });
  await saveOtpModel.save();
  if (!sent) {
    return res.status(500).json({ message: "Failed to send OTP" });
  }

  res.status(200).json({ message: "OTP sent to your registered phone number" });
};

// veryfiging the customer enterd phone number by otp verification
const sendOtpForVerifyPhoneNumber = async (req, res) => {
  const { phoneNumber } = req.body;
  try {
    const generatedOtp = generateOTP();
    const sent = await sendOTP(phoneNumber, generatedOtp);
    const saveOtpModel = new Otp({
      phoneNumber,
      otp: generatedOtp,
    });
    await saveOtpModel.save();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server erroe" });
  }
};

// Step 2: Verify OTP
const verifyOtp = async (req, res) => {
  const { phoneNumber, otp } = req.body;
  try {
    const record = await Otp.findOne({ phoneNumber });
    if (!record) return res.status(400).json({ message: "expired OTP" });
    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid or OTP" });
    }

    // Delete the OTP record after successful verification
    await Otp.deleteOne({ phoneNumber });

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server erroe" });
  }
};

// Step 3: Reset Password
const resetPasswordCustomer = async (req, res) => {
  const { phoneNumber, newPassword } = req.body;

  const customer = await Customer.findOne({ phoneNumber });
  if (!customer) {
    return res.status(404).json({ message: "Customer not found" });
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  customer.password = hashedPassword;
  await customer.save();

  res.status(200).json({ message: "Password reset successfully" });
};

const resetPasswordVendor = async (req, res) => {
  const { phoneNumber, newPassword } = req.body;

  const vendor = await Vendor.findOne({ phoneNumber });
  if (!vendor) {
    return res.status(404).json({ message: "vendor not found" });
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  vendor.password = hashedPassword;
  await vendor.save();

  res.status(200).json({ message: "Password reset successfully" });
};

module.exports = {
  sendOtpToCustomerPhone,
  sendOtpForVerifyPhoneNumber,
  verifyOtp,
  resetPasswordCustomer,resetPasswordVendor,
  sendOtpToVendorPhone,
};
