const Adress = require("../models/Adress");
const Customer = require("../models/Customer");

const addAdressByCostomerId = async (req, res) => {
  const customerId = req.params.customerid;
  const {
    fullName,
    phoneNumber,
    alternatePhoneNumber,
    pinCode,
    district,
    city,
    state,
    houseNoBuildingName,
    roadNameAreaColoney,
    nearbyLandmark,
    isItPrimary,
    typeOfAdress,
  } = req.body;
  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      res.status(400).json({ message: "customer not found" });
    }
    const newAdress = new Adress({
      fullName,
      phoneNumber,
      alternatePhoneNumber,
      pinCode,
      district,
      city,
      state,
      houseNoBuildingName,
      roadNameAreaColoney,
      nearbyLandmark,
      isItPrimary,
      typeOfAdress,
      customer: customerId,
    });
    const adress = await newAdress.save();
    customer.adressList.push(adress);
    const updatedCustomer = await customer.save();
    return res.status(200).json({
      message: "adress added successfully",
      //customerAdressList: updatedCustomer.adressList,
      customerAdressList: updatedCustomer.adressList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
    addAdressByCostomerId
};