import Invoice from "../models/InvoiceModel.js";

export const createInvoice = async (req, res) => {
  console.log("Creating invoice...");
  console.log("Request body:", req.body); // <--- check what mobile is sending
  try {
    const invoice = new Invoice({
      ...req.body.invoiceData,
    });
    const savedInvoice = await invoice.save();
    res.status(201).json(savedInvoice);
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(400).json({ message: error.message });
  }
};

export const inputValidation = async (req, res) => {
  console.log("Request body:", req.body); // <--- check what mobile is sending

  try {
    const existingInvoiceNumber = await Invoice.findOne({
      invoiceNumber: req.body.invoiceNumber,
    });
    if (existingInvoiceNumber) {
      console.log("Invoice number already exists");
      return res
        .status(409)
        .json({ message: "Invoice number already exists", exists: true });
    } else {
      console.log("Invoice number is unique");
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking invoice number:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getAllInvoice = async (req, res) => {
  try {
    const allInvoice = await Invoice.find().sort({invoiceNumber: -1});
    res.status(200).json(allInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const id = req.params;
    // console.log(id)
    const invoice = await Invoice.findById(id.id);
    res.status(200).json(invoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
    console.error("Failed to get invoice by id : ", { error: err.message });
  }
};

export const getNextInvoiceNumber = async (req, res) => {
  try {
    const lastInvoice = await Invoice.findOne().sort({ invoiceNumber: -1 });
    const nextInvoiceNumber = lastInvoice ? lastInvoice.invoiceNumber + 1 : 1;
    res.json({ nextInvoiceNumber });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const id = req.params.id;
    const invoice = await Invoice.findByIdAndDelete(id);
    res.status(200).json(invoice);
  } catch (err) {
    console.error("Error deleting invoice : ", err);
  }
};
