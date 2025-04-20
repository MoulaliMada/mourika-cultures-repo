const express = require("express");
const {
  sendOtpToCustomerPhone,
  resetPasswordVendor,
  verifyOtp,
  resetPasswordCustomer,
  sendOtpToVendorPhone,
  sendOtpForVerifyCustomerPhoneNumber,
  sendOtpForVerifyVendorPhoneNumber,
} = require("../controllers/passwordResetController");

const router = express.Router();

router.post("/reset-password/send-otp-cutomer", sendOtpToCustomerPhone);
router.post("/reset-password/send-otp-vendor", sendOtpToVendorPhone);
router.post(
  "/customer/verify-phonenumber/send-otp",
  sendOtpForVerifyCustomerPhoneNumber
);
router.post(
  "/vendor/verify-phonenumber/send-otp",
  sendOtpForVerifyVendorPhoneNumber
);
router.post("/verify-otp", verifyOtp);
router.post("/cutomer/reset-password", resetPasswordCustomer);
router.post("/vendor/reset-password", resetPasswordVendor);

module.exports = router;
