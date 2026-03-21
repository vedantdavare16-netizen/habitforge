import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function AddHabit() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    frequency: "",
    color: "",
    icon: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🚨 IMPORTANT VALIDATION (added)
    if (!formData.name || formData.name.trim() === "") {
      alert("Habit name is required");
      return;
    }

    try {
      await API.post("/habits", formData);
      alert("Habit created successfully!");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
    
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-xl w-full max-w-md">
      
      <h1 className="text-2xl font-bold text-center mb-6">➕ Add Habit</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          type="text"
          name="name"
          placeholder="Habit Name"
          value={formData.name}
          onChange={handleChange}
          className="p-2 rounded bg-white/20 outline-none"
        />

        <input
          type="text"
          name="frequency"
          placeholder="Frequency (e.g. Daily)"
          value={formData.frequency}
          onChange={handleChange}
          className="p-2 rounded bg-white/20 outline-none"
        />

        <input
          type="text"
          name="color"
          placeholder="Color"
          value={formData.color}
          onChange={handleChange}
          className="p-2 rounded bg-white/20 outline-none"
        />

        <input
          type="text"
          name="icon"
          placeholder="Icon (emoji)"
          value={formData.icon}
          onChange={handleChange}
          className="p-2 rounded bg-white/20 outline-none"
        />

        <button className="bg-indigo-500 hover:bg-indigo-600 py-2 rounded-lg transition">
          Create Habit
        </button>

      </form>

    </div>
  </div>
);
}

export default AddHabit;