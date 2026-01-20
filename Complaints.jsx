import { useState } from "react";
import axios from "axios";
import "./Complaints.css";
import { toast } from 'react-toastify';
function decodeJWT(token) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function Complaints() {
  const [formData, setFormData] = useState({
    isAnonymous: false,
    categoryType: "",
    statusType: "PENDING",
    description: "",
    urgencyType: "",
    attachedUrl: "",
    userId: null,
  });

  // Extract userId from JWT
  const jwtToken = localStorage.getItem("jwtToken");
  const decoded = decodeJWT(jwtToken);
  const extractedUserId = decoded?.userId;
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, attachedUrl: file.name });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalData = {
      ...formData,
      userId: extractedUserId,
    };

    try {
      const res = await axios.post("http://localhost:8080/api/complaint/add-complaint", finalData, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      toast.success("Complaint Added Successfully!");
      console.log(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit complaint.");
    }
  };

  return (
    <div className="complaints-container">
      <h2 className="complaints-title">Create a Grievance📝</h2>

      <form onSubmit={handleSubmit}>
        
      
        <div className="form-group">
          <label>Complaint Type:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="anonymous"
                onChange={() => setFormData({ ...formData, isAnonymous: true })}
              />
              Anonymous
            </label>

            <label>
              <input
                type="radio"
                name="anonymous"
                onChange={() => setFormData({ ...formData, isAnonymous: false })}
              />
              Public🙋‍♂️
            </label>
          </div>
        </div>

        {/* Category Dropdown */}
        <div className="form-group">
          <label>Category Type</label>
          <select
            onChange={(e) =>
              setFormData({ ...formData, categoryType: e.target.value })
            }
          >
            <option value="">Select Category</option>
            <option value="Technical">Technical</option>
            <option value="Administrative">Administrative</option>
            <option value="SERVICE">Service</option>
          </select>
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            placeholder="Write your issue here..."
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          ></textarea>
        </div>

        <div className="form-group">
          <label>Urgency Type</label>
          <select
            onChange={(e) =>
              setFormData({ ...formData, urgencyType: e.target.value })
            }
          >
            <option value="">Select Urgency Level</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
            <option value="MILD">Mild</option>
          </select>
        </div>

        {/* File Upload */}
        <div className="form-group">
          <label>Attach File</label>
          <input type="file" onChange={handleFileUpload} />
        </div>

        {/* Submit Button */}
        <button className="submit-btn">Submit Complaint</button>
      </form>
    </div>
  );
}

export default Complaints;
