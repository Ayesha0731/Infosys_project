import { useEffect, useState } from "react";
import { getAllComplaints } from "../service/complaintService";
import "./AdminPanel.css";

function RecentComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await getAllComplaints();
      setComplaints(res.slice(0, 5)); 
    } catch (err) {
      console.error("Error fetching complaints", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshCount(prev => prev + 1);
    fetchComplaints();
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

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'open': return '📄';
      case 'inprogress': return '⚡';
      case 'resolved': return '✅';
      case 'pending': return '⏳';
      case 'escalated': return '🚨';
      default: return '📊';
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="rec-container">
      <div className="rec-header">
        <div className="rec-header-content">
          <h2 className="rec-title">📋 Recent Complaints</h2>
          <p className="rec-subtitle">Latest complaints raised by users</p>
        </div>
        <div className="rec-header-actions">
          <button 
            className="rec-refresh-btn"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="rec-spinner"></span>
                Refreshing...
              </>
            ) : (
              <>
                <span className="rec-btn-icon">🔄</span>
                Refresh
              </>
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rec-loading-container">
          <div className="rec-spinner-large"></div>
          <p>Loading recent complaints...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="rec-empty-state">
          <div className="rec-empty-icon">📭</div>
          <h3>No Recent Complaints</h3>
          <p>No complaints have been raised recently</p>
        </div>
      ) : (
        <div className="rec-complaints-list">
          {complaints.map((complaint) => (
            <div className="rec-complaint-card" key={complaint.complaintsId}>
              <div className="rec-card-header">
                <div className="rec-complaint-id">
                  <span className="rec-id-label">Complaint Id</span>
                  <span className="rec-id-number">#{complaint.complaintsId}</span>
                </div>
                <div className="rec-time-ago">
                  <span className="rec-time-icon">🕒</span>
                  {getTimeAgo(complaint.createdDate)}
                </div>
              </div>

              <div className="rec-complaint-content">
                <div className="rec-issue-section">
                  <div className="rec-section-label">
                    <span className="rec-label-icon">📝</span>
                    Issue Description
                  </div>
                  <p className="rec-issue-text">{complaint.description}</p>
                </div>

                <div className="rec-complaint-meta">
                  <div className="rec-meta-item">
                    <span className="rec-meta-label">👤 User ID</span>
                    <span className="rec-meta-value">{complaint.userId}</span>
                  </div>
                  {complaint.categoryType && (
                    <div className="rec-meta-item">
                      <span className="rec-meta-label">📂 Category</span>
                      <span className="rec-meta-value">{complaint.categoryType}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="rec-card-footer">
                <div className="rec-status-section">
                  <div className="rec-status-label">
                    <span className="rec-label-icon">📊</span>
                    Status
                  </div>
                  <span 
                    className="rec-status-badge"
                    style={{ backgroundColor: getStatusColor(complaint.statusType) }}
                  >
                    <span className="rec-status-icon">
                      {getStatusIcon(complaint.statusType)}
                    </span>
                    {complaint.statusType}
                  </span>
                </div>
                
                {complaint.assignedEmployeeId && (
                  <div className="rec-assigned-info">
                    <span className="rec-assigned-label">👨‍💼 Assigned to:</span>
                    <span className="rec-assigned-value">EMP#{complaint.assignedEmployeeId}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {complaints.length > 0 && (
        <div className="rec-footer">
          <div className="rec-stats">
            <span className="rec-stat-item">
              <span className="rec-stat-icon">📊</span>
              Showing {complaints.length} of 5 most recent
            </span>
            <span className="rec-stat-item">
              <span className="rec-stat-icon">🔄</span>
              Refreshed {refreshCount} times
            </span>
          </div>
          <div className="rec-note">
            <span className="rec-note-icon">ℹ️</span>
            Showing latest complaints. Click refresh to update.
          </div>
        </div>
      )}
    </div>
  );
}

export default RecentComplaints;