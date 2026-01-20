// utils/jwtUtils.js
export const getUserIdFromToken = () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) return null;

  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.userId; // adjust key if backend uses different name
};
