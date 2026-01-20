import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Feedback.css";
import { getUserIdFromToken } from "../utils/jwtUtils";

const BASE_URL = "http://localhost:8080";

function Feedback() {
  const [feedbackDesc, setFeedbackDesc] = useState("");
  const [rating, setRating] = useState("");
  const [loading, setLoading] = useState(false);

  const submitFeedback = async (e) => {
    e.preventDefault();

    if (!feedbackDesc || !rating) {
      toast.warn("⚠️ Please provide rating and feedback");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("jwtToken");
      const userId = getUserIdFromToken(); // 🔹 from JWT

      await axios.post(
        `${BASE_URL}/api/feedback/${userId}`,
        {
          feedback_desc: feedbackDesc,
          ratings: rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("✅ Feedback submitted successfully!");
      setFeedbackDesc("");
      setRating("");
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to submit feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="feed-container">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="feed-heading">⭐ Feedback & Rating</h2>

      <form className="feed-form" onSubmit={submitFeedback}>
        {/* Rating */}
        <div className="feed-group">
          <label className="feed-label">Rating</label>
          <select
            className="feed-select"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="">Select Rating</option>
            <option value="1">⭐ 1</option>
            <option value="2">⭐⭐ 2</option>
            <option value="3">⭐⭐⭐ 3</option>
            <option value="4">⭐⭐⭐⭐ 4</option>
            <option value="5">⭐⭐⭐⭐⭐ 5</option>
          </select>
        </div>

        {/* Feedback Text */}
        <div className="feed-group">
          <label className="feed-label">Your Feedback</label>
          <textarea
            className="feed-textarea"
            placeholder="Write your feedback..."
            value={feedbackDesc}
            onChange={(e) => setFeedbackDesc(e.target.value)}
          />
        </div>

        <button className="feed-submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}

export default Feedback;
