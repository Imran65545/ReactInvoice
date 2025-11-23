import { StyleSheet } from "@react-pdf/renderer";
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#ffffff",

    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  invoiceContainer: {
    display: "flex",
    flexDirection: "column",
    // justifyContent: "space-between",
    // height: "100%",
  },
  headerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    textAlign: "center",
  },
  companyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    letterSpacing: 0.025,
  },
  companyContactDetails: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    textAlign: "center",
    alignContent: "center",
    width: "100%",
    fontSize: 10,
    marginBottom: 10,
    marginTop: 5,
  },
  invoiceTag: {
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 1,
    marginTop: 5,
    textTransform: "uppercase"
  },
  customerDetailsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  customerDetails: {
    display: "flex",
    flexDirection: "column",
    fontSize: 10,
    // maxWidth: "50%",
    width: "60%",

  },
  dateInvoiceContainer: {
    display: "flex",
    flexDirection: "column",
  },

  table: {
    display: "table",
    width: "100%", // full width
    marginTop:10,
    // borderCollapse: "collapse",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderColor: "gray",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    padding: 5,
    fontSize: 10,
    textAlign:"left",
    textTransform: "capitalize"
  },
  tableHeader:{
    padding: 5,
    fontSize: 10,
    // textAlign:"center",
    fontWeight: "bold",
    color:"#fff",
    backgroundColor: "#000",
    textTransform: "capitalize"
  },

  footerContainer:{
    width: "100%",
    display: "flex",
    flex: 1, // take up remaining space
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,

  },
  signatureContainer:{
    display: "flex",
    width: "50%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    textAlign: "center",
    paddingTop: 20,

  },
  text: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
  label: {
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default styles;
