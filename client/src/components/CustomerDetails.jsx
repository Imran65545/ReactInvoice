const CustomerDetails = ({ customer }) => {
  if (!customer) return null;
  // console.log(customer)
  return (
    <div className="sm:w-1/2 w-full ">
      <h1 className="text-lg">To</h1>
      <p className="font-bold text-xl"> {customer.name}</p>
      <p className=" text-md">
        <span className="font-bold">Address:</span> {customer.address}
      </p>
      <p className=" text-md">
        <span className="font-bold ">GST Number:</span> {customer.gstNumber || customer.gst}
      </p>
      <p className=" text-md">
        <span className="font-bold ">Transport:</span> {customer.transport && customer.transport.length ? customer.transport[0] : "N/A"}
      </p>
    </div>
  );
};

export default CustomerDetails;
