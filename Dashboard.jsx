import { useState } from "react";
import "./Dashboard.css";
import Complaints from "./Complaints";
import ComplaintStatus from "./ComplaintStatus";
import Feedback from "./Feedback";

function Dashboard() {
  const [activePage, setActivePage] = useState("create");

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    window.location.href = "/";
  };

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="user-circle">U</div>
          <span className="user-label">User Panel</span>
        </div>

        <ul className="dashboard-menu">
          <li
            className={activePage === "create" ? "active" : ""}
            onClick={() => setActivePage("create")}
          >
            📝 Create Complaint
          </li>

          <li
            className={activePage === "status" ? "active" : ""}
            onClick={() => setActivePage("status")}
          >
            📊 Complaint Status
          </li>

          <li
            className={activePage === "feedback" ? "active" : ""}
            onClick={() => setActivePage("feedback")}
          >
            ⭐ Feedback & Rating
          </li>
        </ul>
      </aside>

    
      <div className="dashboard-main">
    
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
       

      
        <main className="dashboard-content">
          {activePage === "create" && <Complaints />}
          {activePage === "status" && <ComplaintStatus />}
          {activePage === "feedback" && <Feedback />}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
