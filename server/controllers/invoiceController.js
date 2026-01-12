import Invoice from "../models/InvoiceModel.js";
import OpenAI from "openai";
import dotenv from "dotenv";
import Tesseract from "tesseract.js";

dotenv.config();

// Groq API - FREE tier: 14,400 requests/day, no credit card required
const groqClient = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});


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
    
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is missing in environment variables");
      return res.status(500).json({ 
        message: "Server configuration error: Missing API Key",
        instructions: "Get a FREE API key from https://console.groq.com/keys (no credit card required)"
      });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    console.log(`File received: ${req.file.originalname}, Size: ${req.file.size}, Mime: ${req.file.mimetype}`);
    
    // Step 1: Extract text from image using OCR (Tesseract.js)
    console.log("Step 1: Extracting text from image using OCR (Tesseract.js)...");
    
    let extractedText;
    try {
      const { data: { text } } = await Tesseract.recognize(
        req.file.buffer,
        'eng', // English language
        {
          logger: (info) => {
            if (info.status === 'recognizing text') {
              console.log(`OCR Progress: ${Math.round(info.progress * 100)}%`);
            }
          }
        }
      );
      
      extractedText = text;
      console.log("OCR extraction completed. Text length:", extractedText.length);
      console.log("Extracted text preview:", extractedText.substring(0, 200) + "...");
      
      if (!extractedText || extractedText.trim().length === 0) {
        return res.status(400).json({
          message: "Could not extract text from image",
          error: "OCR returned empty text. Please ensure the image is clear and contains readable text."
        });
      }
    } catch (ocrError) {
      console.error("OCR Error:", ocrError);
      return res.status(500).json({
        message: "Failed to extract text from image",
        error: ocrError.message,
        suggestion: "Please ensure the image is clear and contains readable text."
      });
    }

    // Step 2: Send extracted text to Groq for structured data extraction
    console.log("Step 2: Sending extracted text to Groq API for structured extraction...");

    const prompt = `Extract the following details from this invoice text and return them in a strict JSON format. Do not include markdown formatting (like \`\`\`json).

Invoice Text:
${extractedText}

Fields to extract:
- invoiceNumber (string)
- date (YYYY-MM-DD format)
- customerName (string)
- customerDetails (object with name, address, gst, etc.)
- items (array of objects with name, quantity, price, hsn, amount)

If a field is not found, use null or empty string.
Ensure numeric values are numbers, not strings.
Return ONLY valid JSON, no additional text.`;

    // Groq models - using current available models
    const models = [
      "llama-3.3-70b-versatile",  // Latest Llama 3.3 model
      "llama-3.1-8b-instant",      // Fast 8B model
      "mixtral-8x7b-32768",        // Mixtral model
      "gemma2-9b-it"               // Gemma model
    ];

    let lastError = null;
    
    // Try each model until one works
    for (const model of models) {
      try {
        console.log(`Trying Groq model: ${model}...`);
        
        const response = await groqClient.chat.completions.create({
          model: model,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 2000,
          temperature: 0.1, // Lower temperature for more consistent JSON output
          response_format: { type: "json_object" }, // Force JSON response
        });

        console.log(`Groq response received using ${model}.`);
        const text = response.choices[0].message.content;
        console.log("Raw Groq text:", text);

        // Clean up the response if it contains markdown code blocks
        const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();

        try {
          const data = JSON.parse(cleanText);
          console.log("Successfully extracted invoice data!");
          return res.json(data);
        } catch (parseError) {
          console.error(`Failed to parse ${model} response:`, text);
          // Try next model
          lastError = parseError;
          continue;
        }
      } catch (apiError) {
        // If model is decommissioned or doesn't exist, try next one
        if (apiError.code === "model_decommissioned" || (apiError.status === 400 && apiError.message?.includes("model"))) {
          console.log(`Model ${model} failed: ${apiError.message}. Trying next model...`);
          lastError = apiError;
          continue;
        }
        
        // For other errors, throw to outer catch
        throw apiError;
      }
    }

    // If all models failed
    throw new Error(`All Groq models failed. Last error: ${lastError?.message || "Unknown error"}.`);

  } catch (error) {
    console.error("Error extracting invoice details:", error);
    
    // Handle rate limiting (Groq free tier: 30 req/min, 14,400/day)
    if (error.status === 429 || error.message?.includes("rate limit")) {
      return res.status(429).json({
        message: "Rate limit exceeded",
        error: "Groq free tier: 30 requests/minute, 14,400 requests/day",
        suggestion: "Wait a minute or upgrade your Groq plan"
      });
    }

    // Handle authentication errors
    if (error.status === 401 || error.message?.includes("Unauthorized")) {
      return res.status(401).json({
        message: "Invalid API key",
        error: "Check your GROQ_API_KEY in .env file",
        instructions: "Get a FREE API key from https://console.groq.com/keys"
      });
    }

    res.status(500).json({
      message: "Internal server error",
      error: error.message,
      stack: error.stack
    });
  }
};