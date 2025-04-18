const express = require("express");
const {
  sendOtpToCustomerPhone,
  resetPasswordVendor,
  verifyOtp,
  resetPasswordCustomer,
  sendOtpToVendorPhone,
  sendOtpForVerifyPhoneNumber,
} = require("../controllers/passwordResetController");

const router = express.Router();

router.post("/reset-password/send-otp-cutomer", sendOtpToCustomerPhone);
router.post("/reset-password/send-otp-vendor", sendOtpToVendorPhone);
router.post("/verify-phonenumber/send-otp",sendOtpForVerifyPhoneNumber);
router.post("/verify-otp", verifyOtp);
router.post("/cutomer/reset-password", resetPasswordCustomer);
router.post("/vendor/reset-password", resetPasswordVendor);

module.exports = router;
