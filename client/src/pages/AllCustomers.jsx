
import { Link } from "react-router-dom";

import CustomerTable from "../components/AllCustomerTable";
import CompanyTitle from "../components/CompanyTitle";
function AllCustomers() {
  return (
    <div className="flex flex-col px-2 sm:px-10 pt-10 sm:py-2 w-full">
      <CompanyTitle />
      <div>
        <Link to="/add-customer">
          <button className="btn font-bold capitalize border rounded-md px-4 py-2 hover:bg-black hover:text-white w-full sm:w-auto">
            add customer
          </button>
        </Link>
      </div>
      <CustomerTable />
    </div>
  );
}

export default AllCustomers;
