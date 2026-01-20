import { useEffect, useState } from "react";
import axios from "axios";
import "./EmployeePanel.css";
import { getUserIdFromToken } from "../utils/jwtUtils";

const BASE_URL = "http://localhost:8080";

function ViewComments() {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployeeComments();
  }, []);

  const fetchEmployeeComments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("jwtToken");
      const empId = getUserIdFromToken();

      const res = await axios.get(
        `${BASE_URL}/api/employee/all-comment/${empId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setComments(res.data);
    } catch (err) {
      console.error("Error fetching comments", err);
      setError("Failed to load comments. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="vwcs-loading-container">
        <div className="vwcs-spinner"></div>
        <p className="vwcs-loading-text">Loading comments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vwcs-error-container">
        <div className="vwcs-error-icon">⚠️</div>
        <p className="vwcs-error-message">{error}</p>
        <button 
          className="vwcs-retry-btn"
          onClick={fetchEmployeeComments}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="vwcs-container">
      <div className="vwcs-header">
        <h2 className="vwcs-title">My Comments</h2>
        <div className="vwcs-header-info">
          <span className="vwcs-count-badge">
            {comments.length} comment{comments.length !== 1 ? 's' : ''}
          </span>
          <button 
            className="vwcs-refresh-btn"
            onClick={fetchEmployeeComments}
            title="Refresh comments"
          >
            ⟳ Refresh
          </button>
        </div>
      </div>

      {comments.length === 0 ? (
        <div className="vwcs-empty-state">
          <div className="vwcs-empty-icon">💬</div>
          <h3 className="vwcs-empty-title">No Comments Yet</h3>
          <p className="vwcs-empty-message">
            You haven't received any comments on your complaints yet.
          </p>
        </div>
      ) : (
        <div className="vwcs-comments-grid">
          {comments.map((item, index) => (
            <div className="vwcs-comment-card" key={item.commentEmpId}>
              <div className="vwcs-card-header">
                <div className="vwcs-complaint-id">
                  <span className="vwcs-id-prefix">Complaint ID</span>
                  <span className="vwcs-id-value">#{item.complaintEmployee?.complaintsId}</span>
                </div>
                <div className="vwcs-card-actions">
                  <span className="vwcs-index-badge">#{index + 1}</span>
                </div>
              </div>

              <div className="vwcs-card-body">
                <div className="vwcs-info-row">
                  <div className="vwcs-info-item">
                    <span className="vwcs-info-label">Date:</span>
                    <span className="vwcs-info-value">
                      {formatDate(item.commentDate)}
                    </span>
                  </div>
                </div>

                <div className="vwcs-section">
                  <h4 className="vwcs-section-title">
                    <span className="vwcs-section-icon">📋</span>
                    Issue Description
                  </h4>
                  <p className="vwcs-issue-description">
                    {item.complaintEmployee?.description || "No description provided"}
                  </p>
                </div>

                <div className="vwcs-section vwcs-admin-comment">
                  <h4 className="vwcs-section-title">
                    <span className="vwcs-section-icon">💼</span>
                    Admin Response
                  </h4>
                  <div className="vwcs-comment-content">
                    <p className="vwcs-comment-text">
                      {item.comment}
                    </p>
                    <div className="vwcs-comment-meta">
                      <span className="vwcs-comment-author">Admin</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="vwcs-card-footer">
                <span className="vwcs-status-indicator">
                  <span className="vwcs-status-dot"></span>
                  Comment Received
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewComments;