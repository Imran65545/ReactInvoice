import { useState } from "react";
import { addCustomer } from "../api/customerApi.js";
import CompanyTitle from "../components/CompanyTitle";
export default function AddCustomerForm() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    gstNumber: "",
    taxType: "",
    taxRate: "",
    transport: [], // Start with one transport field
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTransportChange = (index, value) => {
    const newTransport = [...formData.transport];
    // console.log(newTransport);
    newTransport[index] = value;
    setFormData({ ...formData, transport: newTransport });
  };

  const addTransportField = () => {
    setFormData({ ...formData, transport: [...formData.transport, ""] });
  };

  const removeTransportField = (index) => {
    const newTransport = formData.transport.filter((_, i) => i !== index);
    setFormData({ ...formData, transport: newTransport });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await addCustomer(formData);
      setMessage("✅ Customer added successfully!");
      setTimeout(() => {
        setMessage("");
      }, 1000);


      // Reset form
      setFormData({
        name: "",
        address: "",
        gstNumber: "",
        taxType: "",
        taxRate: "",
        transport: [],
      });
    } catch (err) {
      console.error("Error adding customer:", err);
      setMessage("❌ Failed to add customer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="flex flex-col px-2 sm:px-10 pt-10 sm:py-2 w-full ">
      <CompanyTitle />
      <div className="flex flex-col  items-center w-full h-full mt-4 sm:mt-10">
        <div className="flex flex-col p-6  border rounded-md max-w-lg  shadow-md">
          <h2 className="text-xl font-bold mb-4">Add Customer</h2>
          {message && <p className="mb-3 text-sm">{message}</p>}
          <form onSubmit={handleSubmit} className="space-y-4 ">
            <input
              type="text"
              name="name"
              placeholder="Customer Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border p-2 w-full"
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              className="border p-2 w-full"
            />

            <input
              type="text"
              name="gstNumber"
              placeholder="GST Number"
              value={formData.gstNumber}
              onChange={handleChange}
              className="border p-2 w-full"
            />

            <select
              name="taxType"
              value={formData.taxType}
              onChange={handleChange}
              required
              className="border p-2 w-full"
            >
              <option value="">Select Tax Type</option>
              <option value="IGST">IGST</option>
              <option value="CGST/SGST">CGST/SGST</option>
            </select>

            <input
              type="number"
              name="taxRate"
              placeholder="Tax Rate (%)"
              value={formData.taxRate}
              onChange={handleChange}
              required
              className="border p-2 w-full"
            />

            <div>
              <label className="block mb-2 font-medium">
                Transport{" "}
                {formData.transport.length === 0 ? (
                  <button
                    type="button"
                    onClick={addTransportField}
                    className="bg-green-500 text-white px-3 rounded"
                  >
                    +
                  </button>
                ) : (
                  ""
                )}{" "}
              </label>
              {formData.transport.map((t, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Transport Name"
                    value={t}
                    onChange={(e) =>
                      handleTransportChange(index, e.target.value)
                    }
                    className="border p-2 flex-1"
                  />
                  {index >= 0 && (
                    <button
                      type="button"
                      onClick={() => removeTransportField(index)}
                      className="bg-red-500 text-white px-3 rounded"
                    >
                      -
                    </button>
                  )}
                  {index === formData.transport.length - 1 && (
                    <button
                      type="button"
                      onClick={addTransportField}
                      className="bg-green-500 text-white px-3 rounded"
                    >
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Saving..." : "Add Customer"}
            </button>
          </form>
        </div>
      </div>
      </div>
    </>
  );
}
