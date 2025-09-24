import { useState } from "react";


const ProductForm = ({
  customers,
  invoice,
  onItemChange,
  onCustomerChange,
}) => {
  let item = invoice.item;
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div>
      <div className="invoiceNUmber flex flex-col justify-between sm:flex-row justify-between gap-2 overflow-x-hidden ">
        <div className="text-md flex items-center ">
          <span className="font-bold">Invoice No. : </span>
          <div
            onDoubleClick={() => {
              console.log("double clicked");
              setIsEditing(true);
            }}
          >
            {isEditing ? (
              <input
                name="invoiceNumber"
                type="number"
                value={invoice.invoiceNumber}
                onChange={onItemChange}
                className="w-15 text-center rounded  px-2 py-1 outline-none border ml-1"
                onBlur={() => setIsEditing(false)} // exit edit mode on blur
                autoFocus
              />
            ) : (
              <span className="ml-1">
                {invoice.invoiceNumber}
              </span>
            )}
          </div>
        </div>
        <input
          type="date"
          name="date"
          id="date"
          value={invoice.date}
          onChange={onItemChange}
          className="w-full sm:w-fit p-2 border rounded"
        />
      </div>
      <div className="mt-4">
        <select
          value={invoice.customerName}
          onChange={onCustomerChange}
          className="w-full sm:w-fit p-2 border rounded"
          required
        >
          <option value="">Select Company Name</option>
          {customers.map((customer, index) => (
            <option key={index} value={customer.name}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>
      <h3 className="text-lg mt-4 font-semibold">Product Details</h3>
      <div className="w-full flex flex-col sm:flex-row flex-wrap gap-2 mb-2">
        <input
          type="text"
          placeholder="Product Name"
          value={item.name}
          name="name"
          onChange={onItemChange}
          className="flex-1 p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={item.quantity}
          name="quantity"
          onChange={onItemChange}
          className="w-full sm:w-24 p-2 border rounded"
          required
          min="1"
        />
        <input
          type="number"
          placeholder="HSN"
          value={item.hsn}
          name="hsn"
          onChange={onItemChange}
          className="w-full sm:w-24 p-2 border rounded"
          // min="1"
        />
        <input
          type="number"
          placeholder="Price"
          value={item.price}
          name="price"
          onChange={onItemChange}
          className="w-full sm:w-32 p-2 border rounded"
          min="1"
          required
          step=".01"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500 w-full sm:w-auto"
      >
        Add Item
      </button>{" "}
      <span>{invoice.items.length > 0 && 15 - invoice.items.length}</span>
    </div>
  );
};

export default ProductForm;
