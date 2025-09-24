import { useEffect, useState } from "react";
import { getAllInvoice, deleteInvoice } from "../api/invoiceApi.js";
import { CustomerMap } from "../utils/CustomerMapping.js";
import { Link } from "react-router-dom";
function AllInvoiceTable() {
  const [invoiceList, setInvoiceList] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchInvoiceList = async () => {
      try {
        const invoiceData = await getAllInvoice();
        setInvoiceList(await CustomerMap(invoiceData));
      } catch (err) {
        console.error(
          "failed to get all the invoices : ",
          err.response.data.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchInvoiceList();
  }, []);

  const handleDelete = async (id) => {
    const res = await deleteInvoice(id);
    // console.log("deleted item",res)
    const filteredInvoiceList =  invoiceList.filter(item => item.invoiceNumber !== res.invoiceNumber)
    // console.log(filteredInvoiceList)
    setInvoiceList(filteredInvoiceList)
  };
  return loading ? (
    <div className="text-center text-lg font-medium">Loading...</div>
  ) : (
    <table className="table-auto w-full border-collapse border border-gray-400 text-sm">
      <thead>
        <tr className="bg-black">
          <th className="border border-gray-400 text-white text-center p-2">
            Sr. No.
          </th>
          <th className="border border-gray-400 text-white  text-center p-2">
            Invoice Number
          </th>
          <th className="border border-gray-400 text-white  text-center p-2">
            Customer Name
          </th>
          <th className="border border-gray-400 text-white  text-center p-2">
            Quantity
          </th>
          <th className="border border-gray-400 text-white  text-center p-2">
            Total
          </th>
          <th className="border border-gray-400 text-white  text-center p-2">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {invoiceList.length ? (
          invoiceList.map((data, index) => (
            <tr key={data._id}>
              <td className="text-center text-md p-1 ">{index + 1}</td>
              <td className="text-center text-md p-1 ">{data.invoiceNumber}</td>
              <td className="text-center text-md p-1 ">
                {data.customerDetails?.name}
              </td>
              <td className="text-center text-md p-1 ">
                {data.items.reduce((sum, item) => sum + item.quantity, 0)}
              </td>
              <td className="text-center text-md p-1 ">{data.grandTotal}</td>
              <td className=" text-center text-md p-1 space-x-2">
                <Link
                  to={`/${data._id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn font-bold capitalize border rounded-md px-4 py-2 hover:bg-black hover:text-white"
                >
                  view
                </Link>
                <button
                  onClick={() => {
                    handleDelete(data._id);
                  }}
                  className="btn font-bold capitalize border rounded-md px-4 py-2 hover:bg-red-500 cursor-pointer hover:text-white"
                >
                  delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={6}
              className="text-center p-2 text-lg capitalize text-red-500 font-medium"
            >
              no data available
            </td>
          </tr>
        )}
      </tbody>
      <tfoot></tfoot>
    </table>
  );
}

export default AllInvoiceTable;
