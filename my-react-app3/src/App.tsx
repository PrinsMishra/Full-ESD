import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmpLogin from "./components/EmpLogin";
import AddJobOffer from "./components/AddJobOffer";
import ViewCareers from "./components/ViewCareers";
import "./App.css";


function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<EmpLogin />} />
        <Route path="/add-offer" element={<AddJobOffer />} />
        <Route path="/careers" element={<ViewCareers />} />
      </Routes>
    </>
  );
}

export default App;
