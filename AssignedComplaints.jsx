import { useEffect, useState } from "react";
import axios from "axios";
import "./AssignedComplaints.css";
import { toast } from 'react-toastify';

const BASE_URL = "http://localhost:8080";

function AssignedComplaints() {
  const [complaints, setComplaints] = useState({
    Technical: [],
    Administrative: [],
    SERVICE: [],
  });

  const [employees, setEmployees] = useState([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [showEmployees, setShowEmployees] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const token = localStorage.getItem("jwtToken");

 
  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    setLoading(true);
    try {
      const categories = ["Technical", "Administrative", "SERVICE"];

      const requests = categories.map((cat) =>
        axios.get(
          `${BASE_URL}/api/complaint/complaint-category?categoryType=${cat}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      );

      const responses = await Promise.all(requests);

      setComplaints({
        Technical: responses[0].data,
        Administrative: responses[1].data,
        SERVICE: responses[2].data,
      });
    } catch (err) {
      console.error("Error fetching complaints", err);
    } finally {
      setLoading(false);
    }
  };

  
  const fetchEmployees = async (complaintId) => {
    try {
      setSelectedComplaintId(complaintId);

      const res = await axios.get(
        `${BASE_URL}/api/employee/all-employee`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEmployees(res.data);
      setShowEmployees(true);
    } catch (err) {
      console.error("Error fetching employees", err);
    }
  };

  /* ================= ASSIGN COMPLAINT ================= */
  const assignComplaint = async (empId) => {
    setAssigning(true);
    try {
      await axios.post(
        `${BASE_URL}/api/employee/assigned-complaints/${selectedComplaintId}/${empId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("✅ Complaint assigned successfully!");
      setShowEmployees(false);
    } catch (err) {
      console.error("Assignment failed", err);
      toast.error("❌ Failed to assign complaint");
    } finally {
      setAssigning(false);
    }
  };

  /* ================= ADD COMMENT ================= */
  const addComment = async (empId) => {
    const text = commentText[empId];

    if (!text || text.trim() === "") {
      alert("⚠️ Comment cannot be empty");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/api/employee/comment-employee/${selectedComplaintId}/${empId}?desc=${encodeURIComponent(
          text
        )}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("✅ Comment added successfully!");
      setCommentText((prev) => ({ ...prev, [empId]: "" }));
    } catch (err) {
      console.error("Comment failed", err);
      toast.error("❌ Failed to add comment");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open': return '#4299e1';
      case 'inprogress': return '#ed8936';
      case 'resolved': return '#38a169';
      case 'pending': return '#d69e2e';
      case 'escalated': return '#9f7aea';
      default: return '#718096';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Technical': return '🔧';
      case 'Administrative': return '📋';
      case 'SERVICE': return '🛠️';
      default: return '📄';
    }
  };

 
  return (
    <div className="assign-container">
      <div className="assign-header">
        <div className="assign-header-content">
          <h1 className="assign-main-title">👥 Assign Complaints</h1>
          <p className="assign-subtitle">Assign complaints to employees and add comments for each assignment</p>
        </div>
        <div className="assign-header-actions">
          <button
            className="assign-refresh-btn"
            onClick={fetchAllCategories}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="assign-spinner"></span>
                Refreshing...
              </>
            ) : (
              <>
                <span className="assign-btn-icon">🔄</span>
                Refresh Complaints
              </>
            )}
          </button>
        </div>
      </div>

     
      {loading ? (
        <div className="assign-loading-container">
          <div className="assign-spinner-large"></div>
          <p>Loading complaints...</p>
        </div>
      ) : (
        <div className="assign-categories-single-column">
          {Object.entries(complaints).map(([category, list]) => (
            <div className="assign-category-section" key={category}>
              <div className="assign-category-header">
                <div className="assign-category-icon-wrapper">
                  <span className="assign-category-icon">{getCategoryIcon(category)}</span>
                </div>
                <div className="assign-category-info">
                  <h2 className="assign-category-title">{category} Complaints</h2>
                  <div className="assign-category-stats">
                    <span className="assign-count-badge">
                      {list.length} {list.length === 1 ? 'complaint' : 'complaints'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="assign-complaints-list">
                {list.length === 0 ? (
                  <div className="assign-empty-complaints">
                    <div className="assign-empty-icon">📭</div>
                    <p>No complaints in this category</p>
                  </div>
                ) : (
                  list.map((c) => (
                    <div className="assign-complaint-card" key={c.complaintsId}>
                      <div className="assign-card-header">
                        <div className="assign-complaint-id">
                          <span className="assign-id-label">complaint-Id</span>
                          <span className="assign-id-number">#{c.complaintsId}</span>
                        </div>
                        <span
                          className="assign-status-badge"
                          style={{ backgroundColor: getStatusColor(c.statusType) }}
                        >
                          {c.statusType}
                        </span>
                      </div>

                      <div className="assign-complaint-content">
                        <div className="assign-issue-section">
                          <div className="assign-section-label">
                            <span className="assign-label-icon">📝</span>
                            Issue Description
                          </div>
                          <p className="assign-issue-text">{c.description}</p>
                        </div>

                        <div className="assign-complaint-meta">
                          <div className="assign-meta-item">
                            <span className="assign-meta-label">👤 User ID</span>
                            <span className="assign-meta-value">{c.userId == null ? 'Anonymous' : c.userId}</span>
                          </div>
                          {c.createdDate && (
                            <div className="assign-meta-item">
                              <span className="assign-meta-label">📅 Created</span>
                              <span className="assign-meta-value">
                                {new Date(c.createdDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="assign-card-footer">
                        <button
                          className="assign-assign-btn"
                          onClick={() => fetchEmployees(c.complaintsId)}
                        >
                          <span className="assign-btn-icon">👤</span>
                          Assign to Employee
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= EMPLOYEE MODAL ================= */}
      {showEmployees && (
        <div className="assign-modal-overlay">
          <div className="assign-modal">
            <div className="assign-modal-header">
              <div className="assign-modal-title-section">
                <h2>Assign Complaint to Employee</h2>
                <p className="assign-modal-subtitle">
                  Complaint ID: <strong>#{selectedComplaintId}</strong>
                </p>
              </div>
              <button
                className="assign-close-btn"
                onClick={() => setShowEmployees(false)}
                disabled={assigning}
              >
                ✕
              </button>
            </div>

            <div className="assign-modal-content">
              {employees.length === 0 ? (
                <div className="assign-empty-employees">
                  <div className="assign-empty-icon">👥</div>
                  <p>No employees available for assignment</p>
                </div>
              ) : (
                <div className="assign-employees-grid">
                  {employees.map((emp) => (
                    <div className="assign-employee-card" key={emp.id}>
                      <div className="assign-employee-header">
                        <div className="assign-employee-id">
                          <span className="assign-employee-id-label">EMP ID</span>
                          <span className="assign-employee-id-number">#{emp.id}</span>
                        </div>
                        <span className="assign-employee-category">
                          {emp.categoryType}
                        </span>
                      </div>

                      <div className="assign-employee-info">
                        <div className="assign-info-row">
                          <span className="assign-info-label">👤 Username</span>
                          <span className="assign-info-value">{emp.user?.username}</span>
                        </div>
                        <div className="assign-info-row">
                          <span className="assign-info-label">📧 Email</span>
                          <span className="assign-info-value">{emp.user?.email || 'Not provided'}</span>
                        </div>
                        {emp.dob && (
                          <div className="assign-info-row">
                            <span className="assign-info-label">🎂 Date of Birth</span>
                            <span className="assign-info-value">{emp.dob}</span>
                          </div>
                        )}
                      </div>

                      <div className="assign-employee-actions">
                        <div className="assign-comment-section">
                          <label className="assign-comment-label">
                            <span className="assign-label-icon">💬</span>
                            Add Comment (Optional)
                          </label>
                          <textarea
                            className="assign-comment-textarea"
                            placeholder="Write comment for this assignment..."
                            value={commentText[emp.id] || ""}
                            onChange={(e) =>
                              setCommentText((prev) => ({
                                ...prev,
                                [emp.id]: e.target.value,
                              }))
                            }
                            rows="3"
                          />
                        </div>

                        <div className="assign-action-buttons">
                          <button
                            className="assign-comment-btn"
                            onClick={() => addComment(emp.id)}
                            disabled={!commentText[emp.id]?.trim()}
                          >
                            <span className="assign-btn-icon">💬</span>
                            Add Comment
                          </button>
                          <button
                            className="assign-select-btn"
                            onClick={() => assignComplaint(emp.id)}
                            disabled={assigning}
                          >
                            {assigning ? (
                              <>
                                <span className="assign-spinner"></span>
                                Assigning...
                              </>
                            ) : (
                              <>
                                <span className="assign-btn-icon">✅</span>
                                Assign Complaint
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="assign-modal-actions">
              <button
                className="assign-cancel-btn"
                onClick={() => setShowEmployees(false)}
                disabled={assigning}
              >
                <span className="assign-btn-icon">✖️</span>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssignedComplaints;