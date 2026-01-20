import axios from "axios";

const BASE_URL = "http://localhost:8080/api/complaint";

export const getAllComplaints = async () => {
  const token = localStorage.getItem("jwtToken");

  const response = await axios.get(`${BASE_URL}/all-complaints`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
