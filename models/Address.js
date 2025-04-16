const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  alternatePhoneNumber: {
    type: String,
  },
  pinCode: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  houseNoBuildingName: {
    type: String,
    required: true,
  },
  roadNameAreaColoney: {
    type: String,
    required: true,
  },
  nearbyLandmark: {
    type: String,
  },
  isItPrimary: {
    type: Boolean,
    required: true,
  },
  typeOfAdress: {
    type: [{ type: String, enum: ["Home", "Work"] }],
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
  },
});

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
