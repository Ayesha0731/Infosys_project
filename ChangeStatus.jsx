import { useEffect, useState } from "react";
import axios from "axios";
import "./ChangeStatus.css";
import { getUserIdFromToken } from "../utils/jwtUtils";
import { toast } from 'react-toastify';

const BASE_URL = "http://localhost:8080";

const STATUS_OPTIONS = ["PENDING", "InProgress", "Resolved"];
const CATEGORIES = ["Technical", "Administrative", "SERVICE"];

function ChangeStatus() {
  const [complaints, setComplaints] = useState({});
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [comment, setComment] = useState("");
  const [statusType, setStatusType] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("jwtToken");
  const adminUserId = getUserIdFromToken();

  useEffect(() => {
    fetchAllCategoryComplaints();
  }, []);

  // Fetch complaints for all categories
  const fetchAllCategoryComplaints = async () => {
    setLoading(true);
    try {
      const requests = CATEGORIES.map((cat) =>
        axios.get(
          `${BASE_URL}/api/complaint/complaint-category?categoryType=${cat}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      );

      const responses = await Promise.all(requests);

      const data = {};
      CATEGORIES.forEach((cat, index) => {
        data[cat] = responses[index].data;
      });

      setComplaints(data);
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    } finally {
      setLoading(false);
    }
  };

  const submitChangeStatus = async () => {
    if (!comment.trim()) {
      toast.error("Please enter comment");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(
        `${BASE_URL}/api/comment/add-comment/${selectedComplaint.complaintsId}/${adminUserId}`,
        null,
        {
          params: {
            desc: comment,
            statusType: statusType,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("✅ Comment and status updated successfully");
      setSelectedComplaint(null);
      setComment("");
      setStatusType("PENDING");

      fetchAllCategoryComplaints();
    } catch (err) {
      console.error("Status update failed", err);
      toast.error("❌ Failed to update status");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return '#d69e2e';
      case 'inprogress': return '#ed8936';
      case 'resolved': return '#38a169';
      case 'open': return '#4299e1';
      case 'escalated': return '#9f7aea';
      default: return '#718096';
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return '⏳';
      case 'inprogress': return '⚡';
      case 'resolved': return '✅';
      case 'open': return '📄';
      case 'escalated': return '🚨';
      default: return '📊';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Technical': return '🔧';
      case 'Administrative': return '📋';
      case 'SERVICE': return '🛠️';
      default: return '📄';
    }
  };



return (
    <div className="chg-container">
      {/* Header Section */}
      <div className="chg-header">
        <div className="chg-header-content">
          <h1 className="chg-main-title">🔄 Update Complaint Status</h1>
          <p className="chg-subtitle">Track and update complaint status with comments across all categories</p>
        </div>
        <div className="chg-header-actions">
          <button 
            className="chg-refresh-btn"
            onClick={fetchAllCategoryComplaints}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="chg-spinner"></span>
                Refreshing...
              </>
            ) : (
              <>
                <span className="chg-btn-icon">🔄</span>
                Refresh Complaints
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="chg-loading-container">
          <div className="chg-spinner-large"></div>
          <p>Loading complaints...</p>
        </div>
      ) : (
        <div className="chg-categories-single-column">
          {CATEGORIES.map((category) => (
            <div className="chg-category-section" key={category}>
              <div className="chg-category-header">
                <div className="chg-category-icon-wrapper">
                  <span className="chg-category-icon">{getCategoryIcon(category)}</span>
                </div>
                <div className="chg-category-info">
                  <h2 className="chg-category-title">{category} Complaints</h2>
                  <div className="chg-category-stats">
                    <span className="chg-count-badge">
                      {complaints[category]?.length || 0} complaints
                    </span>
                  </div>
                </div>
              </div>

              <div className="chg-complaints-list">
                {!complaints[category] || complaints[category].length === 0 ? (
                  <div className="chg-empty-complaints">
                    <div className="chg-empty-icon">📭</div>
                    <p>No complaints in this category</p>
                  </div>
                ) : (
                  complaints[category].map((c) => (
                    <div className="chg-complaint-card" key={c.complaintsId}>
                      <div className="chg-card-header">
                        <div className="chg-complaint-id">
                          <span className="chg-id-label">Complaint-Id</span>
                          <span className="chg-id-number">#{c.complaintsId}</span>
                        </div>
                        <span 
                          className="chg-status-badge"
                          style={{ backgroundColor: getStatusColor(c.statusType) }}
                        >
                          <span className="chg-status-icon">
                            {getStatusIcon(c.statusType)}
                          </span>
                          {c.statusType}
                        </span>
                      </div>

                      <div className="chg-complaint-content">
                        <div className="chg-issue-section">
                          <div className="chg-section-label">
                            <span className="chg-label-icon">📝</span>
                            Issue Description
                          </div>
                          <p className="chg-issue-text">{c.description}</p>
                        </div>

                        <div className="chg-complaint-meta">
                          <div className="chg-meta-item">
                            <span className="chg-meta-label">👤 User ID</span>
                            <span className="chg-meta-value">{c.userId == null ? "Anonymous" : c.userId}</span>
                          </div>
                          {c.createdDate && (
                            <div className="chg-meta-item">
                              <span className="chg-meta-label">📅 Created</span>
                              <span className="chg-meta-value">
                                {new Date(c.createdDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="chg-card-footer">
                        <button
                          className="chg-change-btn"
                          onClick={() => setSelectedComplaint(c)}
                        >
                          <span className="chg-btn-icon">🔄</span>
                          Update Status
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

     
      {selectedComplaint && (
        <div className="chg-modal-overlay">
          <div className="chg-modal">
            <div className="chg-modal-header">
              <div className="chg-modal-title-section">
                <h2>Update Complaint Status</h2>
                <p className="chg-modal-subtitle">
                  Complaint ID: <strong>#{selectedComplaint.complaintsId}</strong>
                </p>
              </div>
              <button 
                className="chg-close-btn"
                onClick={() => setSelectedComplaint(null)}
                disabled={submitting}
              >
                ✕
              </button>
            </div>

            <div className="chg-modal-content">
            
              <div className="chg-current-status">
                <div className="chg-status-label">
                  <span className="chg-label-icon">📊</span>
                  Current Status
                </div>
                <div className="chg-current-status-badge">
                  <span 
                    className="chg-status-indicator"
                    style={{ backgroundColor: getStatusColor(selectedComplaint.statusType) }}
                  >
                    {getStatusIcon(selectedComplaint.statusType)}
                  </span>
                  <span className="chg-status-text">{selectedComplaint.statusType}</span>
                </div>
              </div>

             
              <div className="chg-form-section">
                <div className="chg-form-group">
                  <label className="chg-form-label">
                    <span className="chg-label-icon">🔄</span>
                    New Status
                  </label>
                  <div className="chg-status-options">
                    {STATUS_OPTIONS.map((status) => (
                      <button
                        key={status}
                        type="button"
                        className={`chg-status-option ${statusType === status ? 'selected' : ''}`}
                        onClick={() => setStatusType(status)}
                        disabled={submitting}
                        style={{ 
                          borderColor: getStatusColor(status),
                          backgroundColor: statusType === status ? getStatusColor(status) : 'white'
                        }}
                      >
                        <span className="chg-status-option-icon">
                          {getStatusIcon(status)}
                        </span>
                        <span className="chg-status-option-text">{status}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment Input */}
                <div className="chg-form-group">
                  <label className="chg-form-label">
                    <span className="chg-label-icon">💬</span>
                    Update Comment
                  </label>
                  <div className="chg-input-hint">
                    Add a comment to explain the status change
                  </div>
                  <textarea
                    className="chg-comment-textarea"
                    placeholder="Write your comment here... Example: 'Issue has been resolved after software update'"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={submitting}
                    rows="5"
                  />
                  <div className="chg-character-count">
                    {comment.length} characters
                  </div>
                </div>

                
                <div className="chg-info-note">
                  <div className="chg-note-icon">ℹ️</div>
                  <div className="chg-note-content">
                    <strong>Note:</strong> Status updates with comments help track 
                    complaint resolution progress and provide transparency to users.
                  </div>
                </div>
              </div>
            </div>

            <div className="chg-modal-actions">
              <button
                className="chg-cancel-btn"
                onClick={() => setSelectedComplaint(null)}
                disabled={submitting}
              >
                <span className="chg-btn-icon">✖️</span>
                Cancel
              </button>
              <button
                className="chg-submit-btn"
                onClick={submitChangeStatus}
                disabled={!comment.trim() || submitting}
              >
                {submitting ? (
                  <>
                    <span className="chg-spinner"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <span className="chg-btn-icon">✅</span>
                    Update Status
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChangeStatus;