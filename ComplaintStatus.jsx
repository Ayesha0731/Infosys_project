import { useEffect, useState } from "react";
import axios from "axios";
import "./ComplaintStatus.css";
import { getUserIdFromToken } from "../utils/jwtUtils";

const BASE_URL = "http://localhost:8080";

function ComplaintStatus() {
    const [complaints, setComplaints] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshCount, setRefreshCount] = useState(0);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            const userId = getUserIdFromToken();
            const token = localStorage.getItem("jwtToken");

            const res = await axios.get(
                `${BASE_URL}/api/complaint/all-complaints/${userId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setComplaints(res.data);
        } catch (error) {
            console.error("Error fetching complaints:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        setRefreshCount(prev => prev + 1);
        fetchComplaints();
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

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'open': return '📄';
            case 'inprogress': return '⚡';
            case 'resolved': return '✅';
            case 'pending': return '⏳';
            case 'escalated': return '🚨';
            default: return '📊';
        }
    };

    const getUrgencyColor = (urgency) => {
        switch (urgency?.toLowerCase()) {
            case 'high': return '#f56565';
            case 'medium': return '#ed8936';
            case 'low': return '#48bb78';
            default: return '#718096';
        }
    };

    return (
        <div className="compst-container">
            {/* Header Section */}
            <div className="compst-header">
                <div className="compst-header-content">
                    <h1 className="compst-main-title">📋 Complaint Status</h1>
                    <p className="compst-subtitle">Track the progress of all your submitted complaints</p>
                </div>
                <div className="compst-header-actions">
                    <button
                        className="compst-refresh-btn"
                        onClick={handleRefresh}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="compst-spinner"></span>
                                Refreshing...
                            </>
                        ) : (
                            <>
                                <span className="compst-btn-icon">🔄</span>
                                Refresh Status
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="compst-stats-summary">
                <div className="compst-stat-card">
                    <div className="compst-stat-icon">📄</div>
                    <div className="compst-stat-info">
                        <span className="compst-stat-value">{complaints.length}</span>
                        <span className="compst-stat-label">Total Complaints</span>
                    </div>
                </div>
                <div className="compst-stat-card">
                    <div className="compst-stat-icon">⚡</div>
                    <div className="compst-stat-info">
                        <span className="compst-stat-value">
                            {complaints.filter(c => c.statusType?.toLowerCase() === 'inprogress').length}
                        </span>
                        <span className="compst-stat-label">In Progress</span>
                    </div>
                </div>
                <div className="compst-stat-card">
                    <div className="compst-stat-icon">✅</div>
                    <div className="compst-stat-info">
                        <span className="compst-stat-value">
                            {complaints.filter(c => c.statusType?.toLowerCase() === 'resolved').length}
                        </span>
                        <span className="compst-stat-label">Resolved</span>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading ? (
                <div className="compst-loading-container">
                    <div className="compst-spinner-large"></div>
                    <p>Loading your complaints...</p>
                </div>
            ) : complaints.length === 0 ? (
                <div className="compst-empty-state">
                    <div className="compst-empty-icon">📭</div>
                    <h3>No Complaints Found</h3>
                    <p>You haven't submitted any complaints yet.</p>
                </div>
            ) : (
                <div className="compst-complaints-list">
                    {complaints.map((complaint) => {
                        const comments = complaint.comments || [];
                        const latestComment = comments[comments.length - 1];

                        const visibleComments =
                            expandedId === complaint.complaintsId
                                ? comments
                                : latestComment
                                    ? [latestComment]
                                    : [];

                        return (
                            <div className="compst-complaint-card" key={complaint.complaintsId}>
                                {/* Card Header */}
                                <div className="compst-card-header">
                                    <div className="compst-header-left">
                                        <div className="compst-complaint-id">
                                            <span className="compst-id-label">COMPLAINT ID</span>
                                            <span className="compst-id-number">#{complaint.complaintsId}</span>
                                        </div>
                                        <div className="compst-complaint-meta">
                                            <span className="compst-meta-item">
                                                <span className="compst-meta-label">📅 Created</span>
                                                <span className="compst-meta-value">{complaint.createdAt}</span>
                                            </span>
                                            <span className="compst-meta-item">
                                                <span className="compst-meta-label">📂 Category</span>
                                                <span className="compst-meta-value">{complaint.categoryType}</span>
                                            </span>
                                            {complaint.urgencyType && (
                                                <span
                                                    className="compst-urgency-badge"
                                                    style={{ backgroundColor: getUrgencyColor(complaint.urgencyType) }}
                                                >
                                                    {complaint.urgencyType} Priority
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="compst-header-right">
                                        <span
                                            className="compst-status-badge"
                                            style={{ backgroundColor: getStatusColor(complaint.statusType) }}
                                        >
                                            <span className="compst-status-icon">
                                                {getStatusIcon(complaint.statusType)}
                                            </span>
                                            {complaint.statusType}
                                        </span>
                                    </div>
                                </div>

                              
                                <div className="compst-issue-section">
                                    <div className="compst-section-label">
                                        <span className="compst-label-icon">📝</span>
                                        Issue Description
                                    </div>
                                    <p className="compst-issue-text">{complaint.description}</p>
                                </div>

                             
                                <div className="compst-timeline-section">
                                    <div className="compst-section-label">
                                        <span className="compst-label-icon">🕒</span>
                                        Status Timeline
                                    </div>

                                    <div className="compst-timeline">
                                        {visibleComments.length === 0 ? (
                                            <div className="compst-no-comments">
                                                <span className="compst-no-comments-icon">📭</span>
                                                <p>No status updates available yet</p>
                                            </div>
                                        ) : (
                                            visibleComments.map((comment, index) => (
                                                <div className="compst-timeline-item" key={comment.commentId}>
                                                    <div className="compst-timeline-dot">
                                                        {index === 0 && (
                                                            <span className="compst-current-dot"></span>
                                                        )}
                                                    </div>
                                                    <div className="compst-timeline-content">
                                                        <div className="compst-timeline-header">
                                                            <span
                                                                className="compst-comment-status"
                                                                style={{ color: getStatusColor(comment.statusType) }}
                                                            >
                                                                <span className="compst-comment-status-icon">
                                                                    {getStatusIcon(comment.statusType)}
                                                                </span>
                                                                {comment.statusType || "SUBMITTED"}
                                                            </span>
                                                            <span className="compst-timeline-date">
                                                                <span className="compst-date-icon">📅</span>
                                                                {comment.date}
                                                            </span>
                                                        </div>
                                                        <p className="compst-timeline-text">{comment.description}</p>
                                                        {comment.userId && (
                                                            <div className="compst-comment-author">
                                                                <span className="compst-author-icon">👤</span>
                                                                Updated by: User #{comment.userId}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                
                                {comments.length > 1 && (
                                    <div className="compst-show-more-container">
                                        <button
                                            className="compst-more-btn"
                                            onClick={() =>
                                                setExpandedId(
                                                    expandedId === complaint.complaintsId
                                                        ? null
                                                        : complaint.complaintsId
                                                )
                                            }
                                        >
                                            {expandedId === complaint.complaintsId ? (
                                                <>
                                                    <span className="compst-btn-icon">👆</span>
                                                    Show Less Timeline
                                                </>
                                            ) : (
                                                <>
                                                    <span className="compst-btn-icon">👇</span>
                                                    Show Full Timeline ({comments.length} updates)
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

           
            {complaints.length > 0 && !loading && (
                <div className="compst-footer">
                    <div className="compst-footer-info">
                        <span className="compst-info-icon">ℹ️</span>
                        <p className="compst-info-text">
                            Showing {complaints.length} complaints •
                            Last updated: Just now •
                            Refreshed {refreshCount} times
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ComplaintStatus;