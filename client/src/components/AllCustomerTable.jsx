import {
  updateTransport,
  deleteCustomer,
  getAllCustomers,
} from "../api/customerApi";
import { useState, useEffect } from "react";
function AllCustomerTable() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fecthCustomerList = async () => {
      try {
        const data = await getAllCustomers();
        setCustomers(data.reverse());
      } catch (err) {
        console.error("Failed to fetch all customers", err);
      } finally {
        setLoading(false);
      }
    };
    fecthCustomerList();
  }, [customers]);
  const handleTransportChange = async (e, customerId, transports) => {
    console.log(e.target.value);
    const selectedTransport = e.target.value;
    // Move selected transport to first position
    const updatedTransports = [
      selectedTransport,
      ...transports.filter((t) => t !== selectedTransport),
    ];
    try {
      await updateTransport(customerId, updatedTransports);
    } catch (err) {
      console.error("Failed to update transport", err);
    }
  };

  const handleDelete = async (id) => {
    const res = await deleteCustomer(id);
    console.log("deleted customer", res);
  };
  return (
    <div className="flex flex-col items-center w-full mt-6 ">
      <div className="w-full overflow-x-auto">
        <table className="min-w-[600px] table-auto w-full border-collapse border border-gray-400 text-sm">
          <thead>
            <tr className="bg-black">
              <th className="border border-gray-400 text-white text-center p-3">
                Sr. No.
              </th>
              <th className="border border-gray-400 text-white text-center p-3">
                Customer Name
              </th>
              <th className="border border-gray-400 text-white text-center p-3">
                Customer Address
              </th>
              <th className="border border-gray-400 text-white text-center p-3">
                Customer GST
              </th>
              <th className="border border-gray-400 text-white text-center p-3">
                Tax Type
              </th>
              <th className="border border-gray-400 text-white text-center p-3">
                Tax Rate
              </th>
              <th className="border border-gray-400 text-white text-center p-3">
                Transport
              </th>
              <th className="border border-gray-400 text-white text-center p-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="text-center text-2xl  font-medium">
                <td className="py-3" colSpan={8}>
                  Loading...
                </td>
              </tr>
            ) : customers.length ? (
              customers.map((data, index) => (
                <tr key={data._id}>
                  <td className="text-center text-md p-3 ">{index + 1}</td>
                  <td className="text-center text-md p-3 ">{data.name}</td>
                  <td className="text-center text-md p-3 ">{data.address}</td>
                  <td className="text-center text-md p-3 ">{data.gstNumber}</td>
                  <td className="text-center text-md p-3 ">{data.taxType}</td>
                  <td className="text-center text-md p-3 ">{data.taxRate}%</td>
                  <td className="text-center text-md p-3 ">
                    {data.transport.length ? (
                      <select
                        name="transport"
                        className="w-full sm:w-auto  px-2 py-1 text-center"
                        onChange={(e) =>
                          handleTransportChange(e, data._id, data.transport)
                        }
                      >
                        {data.transport.map((transport, idx) => (
                          <option key={idx} value={transport}>
                            {transport}
                          </option>
                        ))}
                      </select>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="text-center text-md p-3 ">
                    <button
                      onClick={() => handleDelete(data._id)}
                      className="btn font-bold capitalize border rounded-md px-4 py-2 hover:bg-red-500 cursor-pointer hover:text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center p-2 text-lg capitalize text-red-500 font-medium"
                >
                  no data available
                </td>
              </tr>
            )}
          </tbody>
          <tfoot></tfoot>
        </table>
      </div>
    </div>
  );
}

export default AllCustomerTable;
