import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CreateInvoice from "./pages/CreateInvoice";
import AllInvoice from "./pages/AllInvoice";
import InvoiceViewer from "./pages/InvoiceViewer";
import CustomerForm from "./components/CustomerForm";
import AllCustomers from "./pages/AllCustomers"
import { SignedIn, SignedOut, SignIn, SignUp } from "@clerk/clerk-react";

function App() {
  return (
    <div className="flex h-screen overflow-auto ">
      <Router>
        <Routes>
          <Route
            path="/sign-in/*"
            element={<div className="flex justify-center items-center h-full w-full"><SignIn routing="path" path="/sign-in" /></div>}
          />
          <Route
            path="/sign-up/*"
            element={<div className="flex justify-center items-center h-full w-full"><SignUp routing="path" path="/sign-up" /></div>}
          />
          <Route
            path="/*"
            element={
              <>
                <SignedIn>
                  <Routes>
                    <Route path="/" element={<AllInvoice />} />
                    <Route path="/create-invoice" element={<CreateInvoice />} />
                    <Route path="/:id" element={<InvoiceViewer />} />
                    <Route path="/add-customer" element={<CustomerForm />} />
                    <Route path="/customers" element={<AllCustomers />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </SignedIn>
                <SignedOut>
                  <Navigate to="/sign-in" />
                </SignedOut>
              </>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
