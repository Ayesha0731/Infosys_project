import { useEffect, useState } from "react";
import axios from "axios";
import UpdateStatus from "./UpdateStatus";
import ViewComments from "./ViewComments";
import "./EmployeePanel.css";
import { getUserIdFromToken } from "../utils/jwtUtils";

const BASE_URL = "http://localhost:8080";
const categories = ["Technical", "Administrative", "SERVICE"];

function EmployeePanel() {
  const [complaintsByCategory, setComplaintsByCategory] = useState({});
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [activeView, setActiveView] = useState("STATUS"); 

   const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    window.location.href = "/";
  };

  useEffect(() => {
    if (activeView === "STATUS") {
      fetchEmployeeComplaints();
    }
  }, [activeView]);

  const fetchEmployeeComplaints = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const empId = getUserIdFromToken();

      const res = await axios.get(
        `${BASE_URL}/api/employee/all-complaints/${empId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const grouped = {};
      categories.forEach((cat) => {
        grouped[cat] = res.data.filter(
          (c) => c.categoryType === cat
        );
      });

      setComplaintsByCategory(grouped);
    } catch (err) {
      console.error("Error fetching employee complaints", err);
    }
  };

  return (
    <div className="empp-layout">
      {/* SIDEBAR */}
      <aside className="empp-sidebar">
        <div className="empp-profile">
          <span className="empp-avatar">👨‍💼</span>
          <h3>Employee Panel</h3>
        </div>

        <ul className="empp-menu">
          <li
            className={activeView === "STATUS" ? "active" : ""}
            onClick={() => setActiveView("STATUS")}
          >
            📝 Update Complaint Status
          </li>

          <li
            className={activeView === "COMMENTS" ? "active" : ""}
            onClick={() => setActiveView("COMMENTS")}
          >
            💬 View My Comments
          </li>
            <li
            className={activeView === "Logout" ? "active" : ""}
            onClick={() => setActiveView("Logout")}
          >
            � Logout
          </li>
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className="empp-content">
        {activeView === "STATUS" && (
          <>
            {categories.map((category) => (
              <section key={category} className="empp-category">
                <h2 className="empp-category-title">
                  {category} Complaints
                </h2>

                {(complaintsByCategory[category] || []).length === 0 && (
                  <p className="empp-empty">No complaints available</p>
                )}

                {(complaintsByCategory[category] || []).map((complaint) => (
                  <div
                    className="empp-card"
                    key={complaint.complaintsId}
                  >
                    <div className="empp-card-info">
                      <h4>Complaint #{complaint.complaintsId}</h4>
                      <p className="empp-issue">
                        <strong>Issue:</strong> {complaint.description}
                      </p>
                    </div>

                    <button
                      className="empp-action-btn"
                      onClick={() => setSelectedComplaint(complaint)}
                    >
                      Change Status
                    </button>
                  </div>
                ))}
              </section>
            ))}
          </>
        )}

        {activeView === "COMMENTS" && <ViewComments />}
         {activeView === "Logout" && handleLogout()}
      </main>

      {selectedComplaint && (
        <UpdateStatus
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}
    </div>
  );
}

export default EmployeePanel;
