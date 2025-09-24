import { useEffect, useState } from "react";
import MyDocument from "./DownloadPDF/DownloadPDF";
import { PDFViewer } from "@react-pdf/renderer";
import { PDFDownload } from "../utils/PDFDownload";
import CustomerDetails from "./CustomerDetails";
import ProductTable from "./ProductTable";
import Footer from "./Footer";
import { checkForUniqueInvoiceNo, createInvoice } from "../api/invoiceApi";
const FinalInvoice = ({ invoice, showInvoice }) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  // Function to submit the invoice to the database
  // It checks for unique invoice number before submitting
  const submitInvoiceToDB = async () => {
    if (isSubmitted || isSubmitting) return; // Prevent duplicate submissions
    const invoiceData = JSON.parse(JSON.stringify(invoice));
    try {
      await checkForUniqueInvoiceNo(invoiceData.invoiceNumber);
      console.log("invoice to send to db",invoiceData)
      await createInvoice(invoiceData);
      alert("Invoice saved successfully!");
      setIsSubmitted(true);
      // Show success message using toast or custom notification
    } catch (error) {
      alert(
        `Invoice number already exists. Please use a different one. Error: ${error.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleAction = async (action) => {
    await submitInvoiceToDB();
    if (action === "print") {
      window.print();
    }
  };

  const handleDownload = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await submitInvoiceToDB();
      await PDFDownload(invoice);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="print:hidden flex w-full justify-center gap-4 mb-2">
        {!isTouchDevice && (
          <button
            className={`cursor-pointer rounded text-white font-bold px-4 py-2 capitalize text-base sm:text-xl bg-blue-500 hover:bg-blue-600`}
            onClick={() => handleAction("print")}
          >
            Print
          </button>
        )}
        <button
          className="cursor-pointer rounded text-white font-bold px-4 py-2 capitalize text-base sm:text-xl bg-blue-500 hover:bg-blue-600"
          onClick={handleDownload}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Download"}
        </button>
      </div>

      <div className="print:hidden w-full h-full flex justify-center ">
        <PDFViewer
          className="w-1/2  h-full rounded shadow-md"
          style={{ minWidth: 320 }}
        >
          <MyDocument invoice={invoice} />
        </PDFViewer>
      </div>
      <div className="print-container flex-col h-auto">
        <div className="invoiceContainer flex flex-col w-full h-full mx-auto">
          <div className="headerContainer">
            <h1 className="invoice font-extrabold text-3xl tracking-wide uppercase">
              Tax Invoice
            </h1>
            <div className="flex justify-between mt-3">
              <CustomerDetails customer={invoice.customerDetails} />
              <div>
                <p className="text-md">
                  <span className="font-bold">Date: </span>
                  {new Date(invoice.date).toLocaleDateString("en-GB")}
                </p>
                <p className="text-md">
                  <span className="font-bold">Invoice No.: </span>
                  {invoice.invoiceNumber}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <ProductTable invoice={invoice} onShowInvoice={!showInvoice} />
          </div>
        </div>
        <div className="footerContainer mt-4">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default FinalInvoice;
