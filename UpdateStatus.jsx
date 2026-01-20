import { useState } from "react";
import axios from "axios";
import "./UpdateStatus.css";
import { getUserIdFromToken } from "../utils/jwtUtils";
import { toast } from 'react-toastify';
import { FaTimes, FaPaperPlane, FaSpinner, FaCommentDots, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const BASE_URL = "http://localhost:8080";

const statusOptions = [
  { value: "PENDING", label: "Pending", color: "#FF9800", icon: "⏳" },
  { value: "InProgress", label: "In Progress", color: "#2196F3", icon: "⚙️" },
  { value: "Resolved", label: "Resolved", color: "#4CAF50", icon: "✅" },
  { value: "Open", label: "Open", color: "#9C27B0", icon: "📂" }
];

function UpdateStatus({ complaint, onClose }) {
  const [statusType, setStatusType] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!statusType || !comment.trim()) {
      setError("Please select a status and write a comment");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const userId = getUserIdFromToken();
      const token = localStorage.getItem("jwtToken");

      await axios.post(
        `${BASE_URL}/api/comment/add-comment/${complaint.complaintsId}/${userId}`,
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

     
      setLoading(false);
      toast.success("Comment and status updated successfully");
      onClose();
    } catch (error) {
      console.error(error);
      setError("Failed to update status. Please try again.");
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusObj = statusOptions.find(s => s.value === status);
    return statusObj ? statusObj.color : "#666";
  };

  const getStatusIcon = (status) => {
    const statusObj = statusOptions.find(s => s.value === status);
    return statusObj ? statusObj.icon : "📝";
  };

  return (
    <div className="upsts-modal-overlay" onClick={onClose}>
      <div className="upsts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="upsts-modal-header">
          <div className="upsts-header-content">
            <FaCommentDots className="upsts-header-icon" />
            <div>
              <h3 className="upsts-title">Update Complaint Status</h3>
              <p className="upsts-subtitle">Complaint ID: #{complaint.complaintsId}</p>
            </div>
          </div>
          <button className="upsts-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="upsts-modal-body">
          <div className="upsts-complaint-preview">
            <span className="upsts-preview-label">Complaint:</span>
            <p className="upsts-preview-text">{complaint.description}</p>
          </div>

          <div className="upsts-form-group">
            <label className="upsts-label">
              <span className="upsts-label-text">Select Status</span>
              {statusType && (
                <span className="upsts-status-indicator" style={{ color: getStatusColor(statusType) }}>
                  {getStatusIcon(statusType)} {statusOptions.find(s => s.value === statusType)?.label}
                </span>
              )}
            </label>
            <div className="upsts-status-grid">
              {statusOptions.map((status) => (
                <button
                  key={status.value}
                  className={`upsts-status-option ${statusType === status.value ? 'upsts-status-selected' : ''}`}
                  onClick={() => setStatusType(status.value)}
                  style={{
                    '--status-color': status.color,
                    '--status-bg': `${status.color}15`
                  }}
                >
                  <span className="upsts-status-icon">{status.icon}</span>
                  <span className="upsts-status-label">{status.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="upsts-form-group">
            <label className="upsts-label">
              <span className="upsts-label-text">Add Comment</span>
              <span className="upsts-char-count">{comment.length}/500</span>
            </label>
            <div className="upsts-textarea-wrapper">
              <textarea
                className="upsts-textarea"
                placeholder="Write your comment here... (Provide details about the status change)"
                value={comment}
                onChange={(e) => {
                  if (e.target.value.length <= 500) {
                    setComment(e.target.value);
                    setError("");
                  }
                }}
                maxLength={500}
                rows={4}
              />
              <div className="upsts-textarea-footer">
                <span className="upsts-hint">
                  <FaExclamationTriangle /> Be clear and specific about the update
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="upsts-error-message">
              <FaExclamationTriangle /> {error}
            </div>
          )}

          <div className="upsts-preview-box">
            <div className="upsts-preview-header">
              <span>Preview:</span>
              {statusType && (
                <span className="upsts-preview-status" style={{ color: getStatusColor(statusType) }}>
                  Status: {statusOptions.find(s => s.value === statusType)?.label}
                </span>
              )}
            </div>
            <div className="upsts-preview-content">
              {comment ? (
                <p className="upsts-preview-comment">{comment}</p>
              ) : (
                <p className="upsts-preview-placeholder">Your comment will appear here...</p>
              )}
            </div>
          </div>
        </div>

        <div className="upsts-modal-footer">
          <button 
            className="upsts-cancel-btn" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="upsts-submit-btn" 
            onClick={handleSubmit}
            disabled={loading || !statusType || !comment.trim()}
          >
            {loading ? (
              <>
                <FaSpinner className="upsts-spinner" />
                Updating...
              </>
            ) : (
              <>
                <FaPaperPlane />
                Update Status
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default UpdateStatus;