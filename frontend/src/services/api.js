import axios from "axios";

const API = axios.create({
  baseURL: "https://habitforge-backend-biji.onrender.com/api"
});
// ✅ Attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN:", token); // debug

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;