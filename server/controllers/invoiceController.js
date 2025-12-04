import Invoice from "../models/InvoiceModel.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


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
    const allInvoice = await Invoice.find().sort({ invoiceNumber: -1 });
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

export const extractInvoiceDetails = async (req, res) => {
  try {
    console.log("Extracting invoice details...");
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is missing in environment variables");
      return res.status(500).json({ message: "Server configuration error: Missing API Key" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString("base64"),
        mimeType: req.file.mimetype,
      },
    };

    console.log(`File received: ${req.file.originalname}, Size: ${req.file.size}, Mime: ${req.file.mimetype}`);
    console.log("Sending request to Gemini...");

    const prompt = `
      Extract the following details from this invoice image and return them in a strict JSON format.
      Do not include markdown formatting (like \`\`\`json).
      
      Fields to extract:
      - invoiceNumber (string)
      - date (YYYY-MM-DD format)
      - customerName (string)
      - customerDetails (object with name, address, gst, etc.)
      - items (array of objects with name, quantity, price, hsn, amount)
      
      If a field is not found, use null or empty string.
      Ensure numeric values are numbers, not strings.
    `;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    console.log("Gemini response received.");

    const text = response.text();
    console.log("Raw Gemini text:", text);

    // Clean up the response if it contains markdown code blocks
    const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      const data = JSON.parse(cleanText);
      res.json(data);
    } catch (parseError) {
      console.error("Failed to parse Gemini response:", text);
      res.status(500).json({ message: "Failed to parse extracted data", raw: text });
    }

  } catch (error) {
    console.error("Error extracting invoice details:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      stack: error.stack
    });
  }
};
