import { Document, Text, Page, View } from "@react-pdf/renderer";
// import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import styles from "./Styles.js";

export default function MyDocument({ invoice }) {
  console.log(invoice);
  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        <View
          className="flex flex-col justify-between h-full "
          style={styles.invoiceContainer}
        >
          <View style={styles.headerContainer}>
            <Text style={styles.companyTitle}>sayad enginnering works</Text>
            <View style={styles.companyContactDetails}>
              <Text className="phone">+91 9867538527</Text>
              <Text style={{ paddingHorizontal: 10 }}>
                sayyedengworks@gmail.com
              </Text>
              <Text className="gst">GST:27AHSPB7715N1ZR</Text>
            </View>
          </View>
          <View>
            <View>
              <Text
                className="invoice font-bold text-3xl tracking-wide"
                style={styles.invoiceTag}
              >
                Tax Invoice
              </Text>
              <View
                className="customerDeatilsContainer flex justify-between mt-5"
                style={styles.customerDetailsContainer}
              >
                <View style={styles.customerDetails}>
                  <Text style={{ fontSize: 18, marginBottom: 2 }}>To</Text>
                  <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                    {invoice.customerDetails.name}
                  </Text>
                  <Text style={{ marginVertical: 2, lineHeight: 0.8 }}>
                    <Text style={styles.label}>Address : </Text>
                    <Text style={styles.text}>
                      {invoice.customerDetails.address}
                    </Text>
                  </Text>
                  <Text>
                    <Text style={styles.label}>GST Number : </Text>
                    <Text style={styles.text}>
                      {invoice.customerDetails.gstNumber}
                    </Text>
                  </Text>
                  <Text>
                    <Text style={styles.label}>Transport : </Text>
                    <Text style={styles.text}>
                      {invoice.customerDetails.transport[0]
                        ? invoice.customerDetails.transport[0]
                        : "N/A"}
                    </Text>
                  </Text>
                </View>
                <View style={styles.dateInvoiceContainer}>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={styles.label}>Date : </Text>
                    <Text style={styles.text}>
                      {new Date(invoice.date).toLocaleDateString("en-GB")}
                    </Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={styles.label}>Invoice No. : </Text>
                    <Text style={styles.text}>{invoice.invoiceNumber}</Text>
                  </View>
                </View>
              </View>
            </View>
            {/* Product Table */}
            <View style={styles.table} wrap>
              {/* Header */}
              <View style={styles.tableRow} fixed break>
                <View style={[styles.tableCol]}>
                  <Text style={[styles.tableHeader, {}]}>Sr. No.</Text>
                </View>
                <View style={[styles.tableCol]}>
                  <Text style={styles.tableHeader}> Product Name</Text>
                </View>
                <View style={[styles.tableCol]}>
                  <Text style={styles.tableHeader}>HSN</Text>
                </View>
                <View style={[styles.tableCol]}>
                  <Text style={styles.tableHeader}>Quantity</Text>
                </View>
                <View style={[styles.tableCol]}>
                  <Text style={styles.tableHeader}>Price</Text>
                </View>
                <View style={[styles.tableCol]}>
                  <Text style={styles.tableHeader}>amount</Text>
                </View>
              </View>
              {/* Rows */}
              {invoice.items.map((item, index) => {
                return (
                  <View style={styles.tableRow} key={index} wrap={false}>
                    <View style={[styles.tableCol, { width: "25%" }]}>
                      <Text style={styles.tableCell}>{index + 1}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: "25%" }]}>
                      <Text style={styles.tableCell}>{item.name}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: "25%" }]}>
                      <Text style={styles.tableCell}>{item.hsn}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: "25%" }]}>
                      <Text style={styles.tableCell}>{item.quantity}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: "25%" }]}>
                      <Text style={styles.tableCell}>{item.price}</Text>
                    </View>
                    <View style={[styles.tableCol, { width: "25%" }]}>
                      <Text style={styles.tableCell}>
                        {(item.quantity * item.price).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                );
              })}
              {/* Simulated rowspan and colspan in last row */}
              <View style={styles.tableRow} fixed break wrap={false}>
                <View
                  style={[
                    styles.tableCol,
                    { width: "100%", paddingTop: 15, paddingLeft: 5 },
                  ]}
                >
                  <View
                    style={{ display: "flex", flexDirection: "column", gap: 5 }}
                  >
                    <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                      Payment Method:
                    </Text>
                    <Text style={{ fontSize: 12 }} className="text-lg">
                      Bank Name: IndusInd Bank Limited
                    </Text>
                    <Text className="text-lg" style={{ fontSize: 12 }}>
                      Account Number: 259867538527
                    </Text>
                    <Text style={{ fontSize: 12 }} className="text-lg">
                      Branch: Bhayander East
                    </Text>
                    <Text className="text-lg" style={{ fontSize: 12 }}>
                      IFSC Code: INDB0000582
                    </Text>
                  </View>
                </View>

                {/* Normal last cell */}
                <View
                  style={[styles.tableCol, { width: "25%" }]}


                >
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        borderStyle: "solid",
                        borderColor: "gray",
                        borderWidth: 1,
                        borderRightWidth: 0,
                        borderLeftWidth: 0,
                        borderTopWidth: 0,
                      },
                    ]}
                  >
                    total
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        borderStyle: "solid",
                        borderColor: "gray",
                        borderWidth: 1,
                        borderRightWidth: 0,
                        borderLeftWidth: 0,
                        borderTopWidth: 0,
                      },
                    ]}
                  >
                    CGST
                    {invoice.customerDetails.taxType === "CGST/SGST"
                      ? `- ${invoice.customerDetails.taxRate}%`
                      : ``}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        borderStyle: "solid",
                        borderColor: "gray",
                        borderWidth: 1,
                        borderRightWidth: 0,
                        borderLeftWidth: 0,
                        borderTopWidth: 0,
                      },
                    ]}
                  >
                    SGST
                    {invoice.customerDetails.taxType === "CGST/SGST"
                      ? `- ${invoice.customerDetails.taxRate}%`
                      : ``}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        borderStyle: "solid",
                        borderColor: "gray",
                        borderWidth: 1,
                        borderRightWidth: 0,
                        borderLeftWidth: 0,
                        borderTopWidth: 0,
                      },
                    ]}
                  >
                    IGST{" "}
                    {invoice.customerDetails.taxType === "IGST"
                      ? `- ${invoice.customerDetails.taxRate}%`
                      : ``}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        borderStyle: "solid",
                        borderColor: "gray",
                        borderWidth: 1,
                        borderRightWidth: 0,
                        borderLeftWidth: 0,
                        borderTopWidth: 0,
                      },
                    ]}
                  >
                    round off
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        fontWeight: "bold",
                      },
                    ]}
                  >
                    grand total
                  </Text>
                </View>
                <View style={[styles.tableCol, { width: "25%" }]}>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        borderStyle: "solid",
                        borderColor: "gray",
                        borderWidth: 1,
                        borderRightWidth: 0,
                        borderLeftWidth: 0,
                        borderTopWidth: 0,
                      },
                    ]}
                  >
                    {invoice.total.toFixed(2)}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        borderStyle: "solid",
                        borderColor: "gray",
                        borderWidth: 1,
                        borderRightWidth: 0,
                        borderLeftWidth: 0,
                        borderTopWidth: 0,
                      },
                    ]}
                  >
                    {invoice.customerDetails.taxType === "CGST/SGST"
                      ? invoice.cgst.toFixed(2)
                      : `-`}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        borderStyle: "solid",
                        borderColor: "gray",
                        borderWidth: 1,
                        borderRightWidth: 0,
                        borderLeftWidth: 0,
                        borderTopWidth: 0,
                      },
                    ]}
                  >
                    {invoice.customerDetails.taxType === "CGST/SGST"
                      ? invoice.sgst.toFixed(2)
                      : `-`}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        borderStyle: "solid",
                        borderColor: "gray",
                        borderWidth: 1,
                        borderRightWidth: 0,
                        borderLeftWidth: 0,
                        borderTopWidth: 0,
                      },
                    ]}
                  >
                    {invoice.customerDetails.taxType === "IGST"
                      ? invoice.igst.toFixed(2)
                      : `-`}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      {
                        borderStyle: "solid",
                        borderColor: "gray",
                        borderWidth: 1,
                        borderRightWidth: 0,
                        borderLeftWidth: 0,
                        borderTopWidth: 0,
                      },
                    ]}
                  >
                    {invoice.roundOff >= 0
                      ? `+${invoice.roundOff.toFixed(2)}`
                      : invoice.roundOff.toFixed(2)}
                  </Text>
                  <Text style={[styles.tableCell, { fontWeight: "bold" }]}>
                    {" "}
                    {invoice.grandTotal.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.footerContainer}  wrap={false}>
            <View
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 50
              }}
            >
              <View
                style={{ width: "50%" }}
                className="termsAndConditionContainer w-1/2 "
              >
                <Text style={[styles.text, { fontWeight: "bold" }]}>
                  Terms and Conditions:
                </Text>
                <View style={{ flexDirection: "column", marginTop: 10 }}>
                  <View style={{ flexDirection: "row", marginBottom: 4 }}>
                    <Text style={[styles.text, { marginHorizontal: 8 }]}>
                      1.
                    </Text>
                    <Text style={styles.text}>
                      Goods once sold cannot be returned
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", marginBottom: 4 }}>
                    <Text style={[styles.text, { marginHorizontal: 8 }]}>
                      2.
                    </Text>
                    <Text style={styles.text}>
                      We are not responsible for breakage and/or shortage of
                      goods after delivery
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={styles.signatureContainer}
                className=" flex flex-col h-full w-1/2   text-center justify-end pt-10"
              >
                <Text
                  style={{ fontSize: 14, fontWeight: "bold" }}
                  className="text-2xl font-bold"
                >
                  Faisal Sayyed
                </Text>
                <Text style={{ fontSize: 10 }} className="text-md font-medium">
                  Proprietor
                </Text>
              </View>
            </View>
            <View

              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                width: "100%",
                borderRadius: 100,
                backgroundColor: "#e5e7eb", // Tailwind's bg-gray-200
              }}
              className="row footer flex justify-center bg-gray-200 rounded-4xl w-full"
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  paddingHorizontal: 5,
                  paddingVertical: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {/* <img src="/images/ion_location-outline.svg" alt="" /> */}
                <Text
                  style={styles.text}
                  className="company-address my-0 mx-2 text-md"
                >
                  E-6, Swastik Estate, Behind Milan Palace Goddev Road,
                  Bhayander (East)-401105
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
