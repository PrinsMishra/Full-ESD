import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmpLogin from "./components/EmpLogin";
import AddJobOffer from "./components/AddJobOffer";
import ViewCareers from "./components/ViewCareers";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import "./App.css";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<EmpLogin />} />

        {/* Protected Routes wrapped in Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-offer" element={<AddJobOffer />} />
          <Route path="/careers" element={<ViewCareers />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
