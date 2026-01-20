import { useEffect, useState } from "react";
import "./Landing.css";
import axios from "axios";

const BASE_URL = "http://localhost:8080";

function Stats() {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    resolvedComplaints: 0,
    pendingComplaints: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    fetchComplaintStats();
  }, []);

  const fetchComplaintStats = async () => {
    try {
      const token = localStorage.getItem("jwtToken");

      const response = await axios.get(
        `${BASE_URL}/api/complaint/all-complaints`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const complaints = response.data || [];


      const total = complaints.length;

      const resolved = complaints.filter(
        (c) => c.statusType?.toUpperCase() === "RESOLVED"
      ).length;

      const pending = complaints.filter(
        (c) => c.statusType?.toUpperCase() === "PENDING"
      ).length;

      setStats({
        totalComplaints: total,
        resolvedComplaints: resolved,
        pendingComplaints: pending,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching complaint stats:", error);
      setStats((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load complaint statistics",
      }));
    }
  };


  if (stats.loading) {
    return (
      <div className="stats-container">
        <h2 className="stats-heading">📝 Complaints Overview</h2>
        <div className="stats-loading">
          <p>Loading statistics...</p>
        </div>
      </div>
    );
  }


  if (stats.error) {
    return null;
  }


  return (
    <div className="stats-container">
      <h2 className="stats-heading">📝 Complaints Overview</h2>

      <div className="stats-cards">
        <div className="stat-card total">
          <h3>Total Complaints ⚡</h3>
          <p>{stats.totalComplaints}</p>
        </div>

        <div className="stat-card resolved">
          <h3>Resolved Complaints ✅</h3>
          <p>{stats.resolvedComplaints}</p>
        </div>

        <div className="stat-card pending">
          <h3>Pending Complaints ⌛</h3>
          <p>{stats.pendingComplaints}</p>
        </div>
      </div>
    </div>
  );
}

export default Stats;
