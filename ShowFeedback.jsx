import { useEffect, useState } from "react";
import axios from "axios";
import "./ShowFeedback.css";
import { FaStar, FaUserCircle, FaRegClock, FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";

const BASE_URL = "http://localhost:8080";

function ShowFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllFeedback();
  }, []);

  const fetchAllFeedback = async () => {
    try {
      const token = localStorage.getItem("jwtToken");

      const res = await axios.get(
        `${BASE_URL}/api/feedback/all-feedback`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFeedbacks(res.data);
    } catch (error) {
      console.error("Error fetching feedback", error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar 
        key={index} 
        className={`sf-star ${index < rating ? 'sf-star-filled' : 'sf-star-empty'}`}
      />
    ));
  };

  return (
    <div className="sf-container">
      <div className="sf-header-container">
        <h2 className="sf-heading">
          <FaStar className="sf-heading-icon" />
          User Feedback & Reviews
        </h2>
        <p className="sf-subheading">What our users say about their experience</p>
      </div>

      {loading && (
        <div className="sf-loading-container">
          <FiLoader className="sf-loading-spinner" />
          <p className="sf-loading-text">Loading feedback...</p>
        </div>
      )}

      {!loading && feedbacks.length === 0 && (
        <div className="sf-empty-state">
          <div className="sf-empty-icon">💬</div>
          <h3 className="sf-empty-title">No Feedback Yet</h3>
          <p className="sf-empty-message">Be the first to share your experience!</p>
        </div>
      )}

      <div className="sf-grid">
        {feedbacks.map((fb) => (
          <div className="sf-card" key={fb.feedbackId}>
            <div className="sf-card-header">
              <div className="sf-user-info">
                <div className="sf-avatar">
                  {fb.userInfo?.username?.charAt(0)?.toUpperCase() || <FaUserCircle />}
                </div>
                <div className="sf-user-details">
                  <span className="sf-username">
                    {fb.userInfo?.username || "Anonymous User"}
                  </span>
                  <div className="sf-rating-display">
                    {renderStars(fb.ratings)}
                    <span className="sf-rating-number">{fb.ratings}.0</span>
                  </div>
                </div>
              </div>
              <FaQuoteLeft className="sf-quote-icon" />
            </div>

            <div className="sf-message-container">
              <p className="sf-message">
                {fb.feedback_desc}
              </p>
              <FaQuoteRight className="sf-quote-icon-right" />
            </div>

            <div className="sf-card-footer">
              <div className="sf-date">
                <FaRegClock className="sf-date-icon" />
                <span>{fb.FeedbackDate}</span>
              </div>
              <div className={`sf-rating-badge sf-rating-${Math.floor(fb.ratings)}`}>
                {fb.ratings}/5
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShowFeedback;