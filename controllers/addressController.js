const Address = require("../models/Address");
const Customer = require("../models/Customer");

const addAddressByCostomerId = async (req, res) => {
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
    const newAddress = new Address({
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
    const address = await newAddress.save();
    customer.addressList.push(address);
    const updatedCustomer = await customer.save();
    return res.status(200).json({
      message: "address added successfully",
      //customerAdressList: updatedCustomer.adressList,
      customerAdressList: updatedCustomer.addressList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// controllers/addressController.js
const updateAddressById = async (req, res) => {
  const addressId = req.params.addressid;
  const updateData = req.body;

  try {
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Update address fields
    Object.keys(updateData).forEach((key) => {
      address[key] = updateData[key];
    });

    const updatedAddress = await address.save();

    res.status(200).json({
      message: "Address updated successfully",
      updatedAddress,
    });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteAddressById = async (req, res) => {
  const addressId = req.params.addressid;

  try {
    // Step 1: Find the address to get the customerId
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    const customerId = address.customer;

    // Step 2: Delete the address
    await Address.findByIdAndDelete(addressId);

    // Step 3: Remove the addressId from customer's addressList
    const customer = await Customer.findById(customerId);
    if (customer) {
      customer.addressList = customer.addressList.filter(
        (id) => id.toString() !== addressId
      );
      await customer.save();
    }

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllAdressesByCustomerId = async (req, res) => {
  const customerId = req.params.customerid;
  try {
    const customer = await Customer.findById(customerId).populate(
      "addressList"
    );
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const customerAddressList = customer.addressList;
    if (!customerAddressList || customerAddressList.length === 0) {
      return res
        .status(404)
        .json({ message: "Customer doesn't have any addresses" });
    }
    return res.status(200).json({
      message: "Addresses fetched successfully",
      addressList: customerAddressList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addAddressByCostomerId,
  updateAddressById,
  deleteAddressById,
  getAllAdressesByCustomerId,
};
