import "./AdminPanel.css";

function Sidebar({ activePage, setActivePage }) {
  return (
    <div className="sidebar">
      <div className="profile">Admin</div>

      <ul>
        <li
          className={activePage === "statistics" ? "active" : ""}
          onClick={() => setActivePage("statistics")}
        >
          Statistics
        </li>

        <li
          className={activePage === "assigned" ? "active" : ""}
          onClick={() => setActivePage("assigned")}
        >
          Assigned Complaints
        </li>

        <li
          className={activePage === "updateStatus" ? "active" : ""}
          onClick={() => setActivePage("updateStatus")}
        >
          Comment & Update Status
        </li>

        <li
          className={activePage === "registerEmployee" ? "active" : ""}
          onClick={() => setActivePage("registerEmployee")}
        >
          Register Employee
        </li>

        <li
          className={activePage === "Escalate complaint" ? "active" : ""}
          onClick={() => setActivePage("Escalate complaint")}
        >
          Escalate Complaint
        </li>

        <li
          className={activePage === "Report & Export" ? "active" : ""}
          onClick={() => setActivePage("Report & Export")}
        >
         Report & Export
        </li>
        <li
          className={activePage === "Feedbacks & Ratings" ? "active" : ""}
          onClick={() => setActivePage("Feedbacks & Ratings")}
        >
         Feedbacks & Ratings
        </li>
         <li
          className={activePage === "Logout" ? "active" : ""}
          onClick={() => setActivePage("Logout")}
        >
         Logout
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
