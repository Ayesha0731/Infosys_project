import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./landingpage/LandingPage";
import Dashboard from "./DashboardSection/Dashboard";
import AdminPanel from "./admin/AdminPanel";
import EmployeePanel from "./employee/EmployeePanel";
import { ToastContainer } from 'react-toastify';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
         <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/adminPanel" element={<AdminPanel/>} />
          <Route path="/employeePanel" element={<EmployeePanel/>} />
      </Routes>
       <ToastContainer /> 
    </BrowserRouter>
  );
}
