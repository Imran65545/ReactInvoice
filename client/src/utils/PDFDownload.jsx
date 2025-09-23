import { pdf } from "@react-pdf/renderer";
import MyDocument from "../components/DownloadPDF/DownloadPDF";
export const PDFDownload = async (invoice) => {
  // generate PDF after DB save
  const blob = await pdf(<MyDocument invoice={invoice} />).toBlob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${invoice.customerDetails.name}_${invoice.date}.pdf`;
  a.click();

  URL.revokeObjectURL(url);
};
