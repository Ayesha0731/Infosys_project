import { useState } from "react";
import "./AdminPanel.css";
import Sidebar from "./Sidebar";
import Statistics from "./Statistics";
import RecentComplaints from "./RecentComplaints";
import AssignedComplaints from "./AssignedComplaints";
import ChangeStatus from "./ChangeStatus";  
import RegisterEmployee from "./RegisterEmployee";
import EscalateComplaints from "./EscalateComplaints";
import ReportsExport from "./ReportsExport";
import { useNavigate } from "react-router-dom";
import ShowFeedback from "./ShowFeedback";

function AdminPanel() {
  const [activePage, setActivePage] = useState("statistics");
  const navigate = useNavigate();
   const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    window.location.href = "/";
  };

  return (
    <div className="admin-panel">
      {/* SIDEBAR */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

   
      <main className="admin-content">
        {activePage === "statistics" && (
          <>
            <Statistics />
            <RecentComplaints />
          </>
        )}

        {activePage === "assigned" && <AssignedComplaints />}
        {activePage === "updateStatus" && <ChangeStatus />}
        {activePage === "registerEmployee" && <RegisterEmployee />}
        {activePage === "Escalate complaint" && <EscalateComplaints />}
        {activePage === "Report & Export" && <ReportsExport />}
        {activePage === "Feedbacks & Ratings" && <ShowFeedback />}
        {activePage === "Logout" && handleLogout()}
      </main>
    </div>
  );
}

export default AdminPanel;
