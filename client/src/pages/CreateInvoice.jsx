import { useState, useEffect } from "react";
import EditForm from "../components/EditForm";
import FinalInvoice from "../components/FinalInvoice";
import CompanyTitle from "../components/CompanyTitle";
import { getNextInvoiceNumber } from "../api/invoiceApi.js";
const Invoice = () => {
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState(null);

  const [invoice, setInvoice] = useState({
    invoiceNumber: "", // Stores the unique invoice number
    date: new Date().toISOString().split("T")[0],
    customerName: "",
    customerDetails: null,
    item: { name: "", quantity: "", price: "", hsn: "", amount: "" }, // Only one item at a time
    items: [],
    igst: 0,
    sgst: 0,
    cgst: 0,
    total: 0,
    roundOff: 0,
    totalGSTValue: 0,
    grandTotal: 0,
  });

  const handleShowInvoice = () => {
    if (invoice.items.length === 0) return;
    setShowInvoice(true);
  };

  useEffect(() => {
    const fetchInvoiceNumber = async () => {
      const nextInvoiceNumber = await getNextInvoiceNumber()
      setInvoiceNumber(nextInvoiceNumber.nextInvoiceNumber);
       setInvoice((prev) => ({
         ...prev,
         invoiceNumber : invoiceNumber
       }))

    };
    fetchInvoiceNumber();
  },[invoiceNumber]);

  return (
    <div className="w-full px-4 py-2 h-full flex flex-col overflow-auto sm:px-10 ">
      <CompanyTitle />
      {/* Switch Container */}
      <div className="print:hidden relative w-full max-w-md mx-auto flex flex-row rounded-xl shadow-md mt-4 mb-4">
        {/* Sliding background */}
        <div
          className={` h-full  w-1/2    absolute top-0 left-0  border border-gray-400  rounded-xl transition-all duration-300 ease-in-out
            ${!showInvoice ? "" : "translate-x-full"}`}
        />
        <button
          onClick={() => setShowInvoice(false)}
          className={`z-10 w-1/2 py-2 transition-all cursor-pointer ${
            !showInvoice ? "font-semibold text-black" : "text-gray-500"
          }`}
        >
          Edit Invoice
        </button>
        <button
          onClick={() => handleShowInvoice()}
          className={`z-10 w-1/2 ${
            invoice.items.length === 0 ? `cursor-not-allowed` : `cursor-pointer`
          }  transition-all ${
            showInvoice ? "font-semibold text-black" : "text-gray-500 "
          }`}
        >
          Preview Invoice
        </button>
      </div>
      {showInvoice ? (
        <>
          <FinalInvoice invoice={invoice} />
        </>
      ) : (
        <>
          <EditForm
            invoice={invoice}
            setInvoice={setInvoice}
            showInvoice={showInvoice}
          />
        </>
      )}
    </div>
  );
};

export default Invoice;
