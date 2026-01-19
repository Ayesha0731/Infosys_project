import { useState } from "react";
import axios from "axios";
import "./ReportsExport.css";
import { toast } from 'react-toastify';

const BASE_URL = "http://localhost:8080";

function ReportsExport() {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    categoryType: "",
    statusType: "",
  });

  const [complaints, setComplaints] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [exportType, setExportType] = useState(""); 
  const [isGenerating, setIsGenerating] = useState(false);


  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  
  const generateReport = async () => {
    setIsGenerating(true);
    try {
      const token = localStorage.getItem("jwtToken");

      const res = await axios.get(
        `${BASE_URL}/api/complaint/filter-complaints`,
        {
          params: filters,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComplaints(res.data);
      setShowAll(false);
    } catch (err) {
      toast.error("❌ Failed to generate report");
    } finally {
      setIsGenerating(false);
    }
  };

 
  const exportReport = () => {
    if (!exportType) {
      toast.error("Please select CSV or PDF");
      return;
    }

    const url =
      `${BASE_URL}/api/complaint/export/csv` +
      `?startDate=${filters.startDate || ""}` +
      `&endDate=${filters.endDate || ""}` +
      `&categoryType=${filters.categoryType || ""}` +
      `&statusType=${filters.statusType || ""}` +
      `&exportType=${exportType.toLowerCase()}`;

  
    window.open(url, "_blank");

    toast.success("✅ Report download started");
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      categoryType: "",
      statusType: "",
    });
  };

  const visibleComplaints = showAll ? complaints : complaints.slice(0, 6);

  return (
    <div className="report-container">
      <div className="report-header">
        <h1 className="report-title">📊 Reports & Export</h1>
        <p className="report-subtitle">Generate and export complaint reports with filters</p>
      </div>

      {/* FILTERS SECTION */}
      <div className="filters-section">
        <h2 className="section-title">Filter Parameters</h2>
        
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">📅</span>
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleChange}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">📅</span>
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleChange}
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">📂</span>
              Category
            </label>
            <select
              name="categoryType"
              value={filters.categoryType}
              onChange={handleChange}
              className="filter-select"
            >
              <option value="">All Categories</option>
              <option value="Technical">Technical</option>
              <option value="Administrative">Administrative</option>
              <option value="SERVICE">SERVICE</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">
              <span className="label-icon">🔄</span>
              Status
            </label>
            <select
              name="statusType"
              value={filters.statusType}
              onChange={handleChange}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="InProgress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="PENDING">Pending</option>
              <option value="Escalated">Escalated</option>
            </select>
          </div>
        </div>

        <div className="filter-actions">
          <button 
            className="clear-btn" 
            onClick={clearFilters}
            disabled={isGenerating}
          >
            Clear Filters
          </button>
          <button 
            className="generate-btn" 
            onClick={generateReport}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <span className="spinner"></span>
                Generating...
              </>
            ) : (
              <>
                <span className="btn-icon">📈</span>
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* EXPORT SECTION */}
      {complaints.length > 0 && (
        <div className="export-section">
          <div className="export-header">
            <h2 className="section-title">
              <span className="section-icon">💾</span>
              Export Report
            </h2>
            <div className="results-count">
              <span className="count-badge">{complaints.length}</span>
              complaints found
            </div>
          </div>

          <div className="export-options">
            <div className="format-selector">
              <button
                className={`format-btn ${exportType === "CSV" ? "format-active" : ""}`}
                onClick={() => setExportType("CSV")}
              >
                <span className="format-icon">📄</span>
                CSV Format
              </button>

              <button
                className={`format-btn ${exportType === "PDF" ? "format-active" : ""}`}
                onClick={() => setExportType("PDF")}
              >
                <span className="format-icon">📑</span>
                PDF Format
              </button>
            </div>

            <div className="selected-format">
              {exportType && (
                <>
                  <span className="selected-label">Selected:</span>
                  <span className="selected-type">{exportType}</span>
                </>
              )}
            </div>

            <button 
              className="export-btn" 
              onClick={exportReport}
              disabled={!exportType}
            >
              <span className="btn-icon">⬇️</span>
              Download {exportType} Report
            </button>
          </div>
        </div>
      )}

      {/* RESULTS SECTION */}
      {complaints.length > 0 && (
        <div className="results-section">
          <div className="results-header">
            <h2 className="section-title">
              <span className="section-icon">📋</span>
              Complaint Results
            </h2>
          </div>

          <div className="report-list">
            {visibleComplaints.map((c) => (
              <div className="report-card" key={c.complaintsId}>
                <div className="card-header">
                  <div className="complaint-id">
                    <span className="id-label">Complaint ID</span>
                    <span className="id-number">#{c.complaintsId}</span>
                  </div>
                  <span className={`status-badge status-${c.statusType?.toLowerCase()}`}>
                    {c.statusType}
                  </span>
                </div>
                
                <p className="complaint-description">{c.description}</p>
                
                <div className="card-footer">
                  <span className="category-tag">
                    <span className="tag-icon">🏷️</span>
                    {c.categoryType}
                  </span>
                  <div className="card-meta">
                    {c.createdDate && (
                      <span className="date-info">
                        <span className="meta-icon">📅</span>
                        {new Date(c.createdDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {complaints.length > 6 && (
            <div className="show-more-container">
              <button 
                className="show-more-btn" 
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? (
                  <>
                    <span className="btn-icon">👆</span>
                    Show Less
                  </>
                ) : (
                  <>
                    <span className="btn-icon">👇</span>
                    Show More ({complaints.length - 6} more)
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ReportsExport;