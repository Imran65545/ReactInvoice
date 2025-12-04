import {
  createInvoice,
  getAllInvoice,
  getInvoiceById,
  inputValidation,
  getNextInvoiceNumber,
  deleteInvoice,
  extractInvoiceDetails
} from "../controllers/invoiceController.js";
import express from "express";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post("/create-invoice", createInvoice);
router.post("/extract-from-image", upload.single("image"), extractInvoiceDetails);
router.post("/check", inputValidation);

router.get("/", getAllInvoice);
router.get("/getInvoiceById/:id", getInvoiceById)
router.get("/getNextInvoiceNumber", getNextInvoiceNumber)
router.delete("/delete-invoice/:id", deleteInvoice)
export default router;
