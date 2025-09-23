import express from "express"
import {getAllCustomer, getCustomerByID, addCustomer, updateTransport, deleteCustomer} from "../controllers/customerController.js"

const router = express.Router()


router.get("/", getAllCustomer)
router.get("/getCustomerByID/:id", getCustomerByID)
router.post("/add-customer",addCustomer)
router.put("/update-transport/:id", updateTransport)
router.delete("/delete-customer/:id",deleteCustomer)
export default router