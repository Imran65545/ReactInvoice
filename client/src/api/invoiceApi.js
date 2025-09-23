import axios from "axios";
const API_URL = import.meta.env.VITE_INVOICE_URL;

export const createInvoice = async (invoiceData) => {
  const res = await axios.post(
    `${API_URL}/create-invoice`,
    { invoiceData },
    {
      headers: {
        "Content-Type": "application/json", // ensure JSON body
      },
    }
  );
  return res.data;
};

export const checkForUniqueInvoiceNo = async (invoiceNumber) => {
  const res = await axios.post(`${API_URL}/check`, { invoiceNumber });
  if (res.data.exists) {
    throw new Error("Duplicate invoice number");
  }
};

export const getAllInvoice = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const getInvoiceById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/getInvoiceById/${id}`);
    return res.data;
  } catch (err) {
    console.error("failed to get invoice by id", err);
  }
};

export const getNextInvoiceNumber = async () => {
  try {
    const res = await axios.get(`${API_URL}/getNextInvoiceNumber`);
    return res.data;
  } catch (err) {
    console.error("failed to get next invoice number", err);
  }
};


export const deleteInvoice = async (id) =>{
  const res = await axios.delete(`${API_URL}/delete-invoice/${id}`)
  return res.data
}