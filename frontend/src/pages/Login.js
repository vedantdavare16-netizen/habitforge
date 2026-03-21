import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ added Link
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", formData);

      // ✅ Save token
      localStorage.setItem("token", res.data.token);

      // 🔥 Optional (future use)
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (error) {
      console.log(error.response);
      console.log(error);
      alert(error.response?.data?.message || "Login failed");
    }
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
    
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-xl w-full max-w-sm">
      
      <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          className="p-2 rounded bg-white/20 outline-none"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          className="p-2 rounded bg-white/20 outline-none"
        />

        <button className="bg-indigo-500 hover:bg-indigo-600 py-2 rounded-lg transition">
          Login
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        Don't have an account?{" "}
        <Link to="/register" className="text-indigo-400 hover:underline">
          Register here
        </Link>
      </p>

    </div>
  </div>
);
}

export default Login;