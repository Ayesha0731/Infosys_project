import { useEffect, useState } from "react";
import axios from "axios";
import "./EscalateComplaint.css";
import { toast } from 'react-toastify';

const BASE_URL = "http://localhost:8080";

const STATUS_OPTIONS = [
  "Open",
  "InProgress",
  "Resolved",
  "PENDING",
  "Escalated",
];

const CATEGORY_TYPES = ["Technical", "Administrative", "SERVICE"];

function EscalateComplaints() {
  const [complaintsByCategory, setComplaintsByCategory] = useState({});
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("Escalated");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    fetchAllCategories();
  }, []);

  // Fetch complaints for ALL categories
  const fetchAllCategories = async () => {
    setLoading(true);
    try {
      const results = await Promise.all(
        CATEGORY_TYPES.map((category) =>
          axios.get(
            `${BASE_URL}/api/complaint/complaint-category?categoryType=${category}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        )
      );

      const data = {};
      CATEGORY_TYPES.forEach((category, index) => {
        data[category] = results[index].data;
      });

      setComplaintsByCategory(data);
    } catch (err) {
      console.error("Failed to fetch complaints", err);
    } finally {
      setLoading(false);
    }
  };

  //  Escalate complaint
  const escalateComplaint = async () => {
    try {
      await axios.post(
        `${BASE_URL}/api/complaint/escalate-complaint/${selectedComplaintId}?statusType=${selectedStatus}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("✅ Complaint escalated successfully!");
      setSelectedComplaintId(null);
      fetchAllCategories();
    } catch (err) {
      toast.error("❌ Complaint must be a week older for escalation");
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'open': return '#4299e1';
      case 'inprogress': return '#ed8936';
      case 'resolved': return '#38a169';
      case 'pending': return '#d69e2e';
      case 'escalated': return '#9f7aea';
      default: return '#718096';
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
    <div className="esc-admin-container">
      <div className="esc-header">
        <h1 className="esc-title">📤 Escalate Complaints</h1>
        <p className="esc-subtitle">Manage and escalate complaints by category</p>
        <div className="esc-header-actions">
          <button 
            className="refresh-btn"
            onClick={fetchAllCategories}
            disabled={loading}
          >
            {loading ? '🔄 Refreshing...' : '🔄 Refresh List'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading complaints...</p>
        </div>
      ) : (
        <div className="esc-categories-grid">
          {CATEGORY_TYPES.map((category) => (
            <div className="esc-category-section" key={category}>
              <div className="category-header">
                <div className="category-icon">
                  {getCategoryIcon(category)}
                </div>
                <div className="category-info">
                  <h2 className="category-title">{category} Complaints</h2>
                  <span className="category-count">
                    {complaintsByCategory[category]?.length || 0} complaints
                  </span>
                </div>
              </div>

              <div className="complaints-list">
                {complaintsByCategory[category]?.length === 0 ? (
                  <div className="no-complaints">
                    <div className="empty-state">📭</div>
                    <p>No complaints found in this category</p>
                  </div>
                ) : (
                  complaintsByCategory[category]?.map((c) => (
                    <div className="esc-complaint-card" key={c.complaintsId}>
                      <div className="complaint-header">
                        <div className="complaint-id">
                          <span className="id-label">Complaint ID</span>
                          <span className="id-number">#{c.complaintsId}</span>
                        </div>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getStatusColor(c.statusType) }}
                        >
                          {c.statusType}
                        </span>
                      </div>
                      
                      <div className="complaint-content">
                        <div className="complaint-description">
                          <div className="desc-label">📝 Issue</div>
                          <p>{c.description}</p>
                        </div>
                        
                        <div className="complaint-details">
                          <div className="detail-item">
                            <span className="detail-label">👤 User ID</span>
                            <span className="detail-value">{c.userId==null ? 'Anonymous' : c.userId}</span>
                          </div>
                          {c.createdDate && (
                            <div className="detail-item">
                              <span className="detail-label">📅 Created</span>
                              <span className="detail-value">
                                {new Date(c.createdDate).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="complaint-actions">
                        <button
                          className="esc-btn"
                          onClick={() => setSelectedComplaintId(c.complaintsId)}
                          disabled={c.statusType === 'Escalated'}
                        >
                          {c.statusType === 'Escalated' ? (
                            <>
                              <span className="btn-icon">✅</span>
                              Already Escalated
                            </>
                          ) : (
                            <>
                              <span className="btn-icon">🚨</span>
                              Escalate Complaint
                            </>
                          )}
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

  
      {selectedComplaintId && (
        <div className="esc-modal-overlay">
          <div className="esc-modal">
            <div className="modal-header">
              <h2>🚨 Escalate Complaint</h2>
              <p className="modal-subtitle">
                Escalating complaint ID: <strong>#{selectedComplaintId}</strong>
              </p>
            </div>

            <div className="modal-content">
              <div className="form-group">
                <label className="form-label">
                  <span className="label-icon">🔄</span>
                  Select New Status
                </label>
                <div className="status-selector">
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status}
                      className={`status-option ${selectedStatus === status ? 'selected' : ''}`}
                      onClick={() => setSelectedStatus(status)}
                      style={{ 
                        borderColor: getStatusColor(status),
                        backgroundColor: selectedStatus === status ? getStatusColor(status) : 'white'
                      }}
                    >
                      <span className="status-icon">
                        {status === 'Escalated' ? '🚨' : 
                         status === 'Resolved' ? '✅' : 
                         status === 'InProgress' ? '⚡' : '📄'}
                      </span>
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div className="modal-note">
                <div className="note-icon">ℹ️</div>
                <p>
                  <strong>Note:</strong> Only complaints that are a week or older can be escalated.
                  Escalated complaints will receive priority attention.
                </p>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => setSelectedComplaintId(null)}
              >
                <span className="btn-icon">✖️</span>
                Cancel
              </button>
              <button
                className="confirm-btn"
                onClick={escalateComplaint}
              >
                <span className="btn-icon">✅</span>
                Confirm Escalation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EscalateComplaints;