import { useEffect, useState } from "react";
import axios from "axios";
import "./Statatics.css";

const BASE_URL = "http://localhost:8080";

function Statistics() {
  const [stats, setStats] = useState([
    { label: "Total Complaints", value: "0", loading: true },
    { label: "Open Complaints", value: "0", loading: true },
    { label: "Resolved Complaints", value: "0", loading: true },
    { label: "Pending Complaints", value: "0", loading: true },
    { label: "In Progress", value: "0", loading: true },
    { label: "Avg Resolution Time", value: "0 Days", loading: true },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaintsData();
  }, []);

  const fetchComplaintsData = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(`${BASE_URL}/api/complaint/all-complaints`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const complaints = response.data;
      calculateStatistics(complaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setStats(prevStats => prevStats.map(stat => ({ ...stat, loading: false })));
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (complaints) => {
    // Count complaints by status
    const statusCounts = {
      Open: 0,
      Resolved: 0,
      PENDING: 0,
      InProgress: 0,
    };

  
    const resolutionTimes = [];
    const totalComplaints = complaints.length;

    complaints.forEach(complaint => {
      const status = complaint.statusType;
      
     
      if (statusCounts[status] !== undefined) {
        statusCounts[status]++;
      } else if (status === "Pending") {
        statusCounts.PENDING++;
      }

     
      if (status === "Resolved" && complaint.comments && complaint.comments.length > 0) {
        const openComment = complaint.comments.find(c => c.statusType === "Open");
        const resolvedComment = complaint.comments.find(c => c.statusType === "Resolved");
        
        if (openComment && resolvedComment && openComment.date && resolvedComment.date) {
          const openDate = new Date(openComment.date);
          const resolvedDate = new Date(resolvedComment.date);
          const diffTime = Math.abs(resolvedDate - openDate);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays > 0) {
            resolutionTimes.push(diffDays);
          }
        }
      }
    });

 
    let avgResolutionTime = 0;
    if (resolutionTimes.length > 0) {
      const totalDays = resolutionTimes.reduce((sum, days) => sum + days, 0);
      avgResolutionTime = Math.round(totalDays / resolutionTimes.length);
    }

    // Update stats
    setStats([
      { 
        label: "Total Complaints", 
        value: totalComplaints.toLocaleString(), 
        icon: "📊",
        loading: false 
      },
      { 
        label: "Open Complaints", 
        value: statusCounts.Open.toLocaleString(), 
        icon: "📄",
        loading: false 
      },
      { 
        label: "Resolved Complaints", 
        value: statusCounts.Resolved.toLocaleString(), 
        icon: "✅",
        loading: false 
      },
      { 
        label: "Pending Complaints", 
        value: statusCounts.PENDING.toLocaleString(), 
        icon: "⏳",
        loading: false 
      },
      { 
        label: "In Progress", 
        value: statusCounts.InProgress.toLocaleString(), 
        icon: "⚡",
        loading: false 
      },
      { 
        label: "Avg Resolution Time", 
        value: avgResolutionTime > 0 ? `${avgResolutionTime} Day${avgResolutionTime > 1 ? 's' : ''}` : "N/A",
        icon: "⏱️",
        loading: false 
      },
    ]);
  };

  const getStatColor = (index) => {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
      'linear-gradient(135deg, #38b2ac 0%, #319795 100%)',
      'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4fd1c7 0%, #319795 100%)'
    ];
    return colors[index % colors.length];
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchComplaintsData();
  };

  return (
    <div className="stat-container">
      <div className="stat-header">
        <div className="stat-header-content">
          <h2 className="stat-main-title">📈 Complaint Statistics</h2>
          <p className="stat-subtitle">Real-time overview of complaint status and resolution metrics</p>
        </div>
        <div className="stat-header-actions">
          <button 
            className="stat-refresh-btn"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="stat-spinner"></span>
                Refreshing...
              </>
            ) : (
              <>
                <span className="stat-btn-icon">🔄</span>
                Refresh Stats
              </>
            )}
          </button>
        </div>
      </div>

      <div className="stat-cards-grid">
        {stats.map((stat, index) => (
          <div 
            className="stat-card" 
            key={index}
            style={{ background: getStatColor(index) }}
          >
            <div className="stat-card-content">
              <div className="stat-card-header">
                <div className="stat-icon-wrapper">
                  <span className="stat-icon">{stat.icon}</span>
                </div>
                <div className="stat-card-trend">
                  <span className="stat-trend-icon">📈</span>
                  <span className="stat-trend-text">Live Data</span>
                </div>
              </div>
              
              <div className="stat-card-body">
                {stat.loading ? (
                  <div className="stat-loading">
                    <span className="stat-mini-spinner"></span>
                  </div>
                ) : (
                  <h3 className="stat-value">{stat.value}</h3>
                )}
                <p className="stat-label">{stat.label}</p>
              </div>

              <div className="stat-card-footer">
                <span className="stat-update-time">
                  <span className="stat-time-icon">🕒</span>
                  Updated just now
                </span>
              </div>
            </div>
            
            <div className="stat-card-decoration">
              <div className="stat-decoration-circle stat-circle-1"></div>
              <div className="stat-decoration-circle stat-circle-2"></div>
              <div className="stat-decoration-circle stat-circle-3"></div>
            </div>
          </div>
        ))}
      </div>

      <div className="stat-footer">
        <div className="stat-info-note">
          <span className="stat-note-icon">ℹ️</span>
          <p className="stat-note-text">
            Statistics are calculated from all complaints in the system. Average resolution time is based on resolved complaints only.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Statistics;