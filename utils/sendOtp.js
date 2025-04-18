const twilio = require("twilio");
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendOTP = async (phoneNumber, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your Mourika Cultures OTP is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phoneNumber}`, // Assuming Indian numbers
    });

    console.log("OTP sent:", message.sid);
    return true;
  } catch (error) {
    console.error("Failed to send OTP:", error);
    return false;
  }
};

module.exports = { sendOTP };
