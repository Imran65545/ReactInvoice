import {
  createInvoice,
  getAllInvoice,
  getInvoiceById,
  inputValidation,
  getNextInvoiceNumber,
  deleteInvoice
} from "../controllers/invoiceController.js";
import express from "express";

const router = express.Router();

router.post("/create-invoice", createInvoice);
router.post("/check", inputValidation);

router.get("/", getAllInvoice);
router.get("/getInvoiceById/:id", getInvoiceById)
router.get("/getNextInvoiceNumber",getNextInvoiceNumber)
router.delete("/delete-invoice/:id",deleteInvoice)
export default router;
