import CustomerDetails from "../models/CustomerModel.js";

export const getAllCustomer = async (req, res) => {
  try {
    const customer = await CustomerDetails.find({});
    res.status(200).json(customer);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch customers", error: err.message });
  }
};

export const getCustomerByID = async (req, res) => {
  try {
    const id = req.params;
    // console.log(id)
    const customerDetails = await CustomerDetails.findById(id.id);
    res.status(200).json(customerDetails);
  } catch (err) {
    console.error("Failed to get customer by id : ", { error: err.message });
  }
};

export const addCustomer = async (req, res) => {
  try {
    const customerData = new CustomerDetails(req.body);
    const customer = await customerData.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateTransport = async (req, res) => {
  try {
    const id = req.params.id;
    const transport = req.body;
    const customer = await CustomerDetails.findByIdAndUpdate(
      id,
      { transport },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Transport updated successfully", customer });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update transport", error: err.message });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const id = req.params.id;
    // const  transport  = req.body;
    console.log("customer to be deleted : ", id);
    const data = await CustomerDetails.findByIdAndDelete(id);
    res.status(200).json({ message: "Customer Deleted successfully", data });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update transport", error: err.message });
  }
};
