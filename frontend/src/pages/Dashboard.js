import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import HabitCard from "../components/HabitCard";
import Heatmap from "../components/Heatmap";
import ProgressChart from "../components/ProgressChart";

function Dashboard() {
  const [habits, setHabits] = useState([]);
  const navigate = useNavigate();

  const fetchHabits = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await API.get("/habits");
      setHabits(res.data);
    } catch (error) {
      console.log(error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  // ✅ NEW: calculate today's completions
  const today = new Date().toISOString().split("T")[0];

 const todayCount = habits.reduce((count, habit) => {
  const lastDate = habit.lastCompletedDate
    ? new Date(habit.lastCompletedDate).toISOString().split("T")[0]
    : null;

  if (lastDate === today) {
    return count + 1;
  }
  return count;
}, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6 text-white">
      
      {/* Header */}
      <h1 className="text-4xl font-bold text-center mb-8 tracking-wide">
        🚀 HabitForge Dashboard
      </h1>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        <Link to="/add">
          <button className="bg-indigo-500 hover:bg-indigo-600 transition px-5 py-2 rounded-xl shadow-lg">
            ➕ Add Habit
          </button>
        </Link>

        <Link to="/profile">
          <button className="bg-pink-500 hover:bg-pink-600 transition px-5 py-2 rounded-xl shadow-lg">
            👤 Profile
          </button>
        </Link>

        <Link to="/leaderboard">
          <button className="bg-yellow-500 hover:bg-yellow-600 transition px-5 py-2 rounded-xl shadow-lg">
            🏆 Leaderboard
          </button>
        </Link>

        <Link to="/charts">
          <button className="bg-blue-500 hover:bg-blue-600 transition px-5 py-2 rounded-xl shadow-lg">
            📊 Charts
          </button>
        </Link>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="bg-red-500 hover:bg-red-600 transition px-5 py-2 rounded-xl shadow-lg"
        >
          🚪 Logout
        </button>
      </div>

      {/* ✅ NEW: STATS SECTION */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10">
        <div className="bg-white text-black p-4 rounded-xl shadow text-center">
          <p className="text-sm text-gray-500">Total Habits</p>
          <h2 className="text-2xl font-bold">{habits.length}</h2>
        </div>

        <div className="bg-white text-black p-4 rounded-xl shadow text-center">
          <p className="text-sm text-gray-500">Completed Today</p>
          <h2 className="text-2xl font-bold">{todayCount}</h2>
        </div>

        <div className="bg-white text-black p-4 rounded-xl shadow text-center">
          <p className="text-sm text-gray-500">Status</p>
          <h2 className="text-lg font-semibold">
            {todayCount > 0 ? "🔥 Active" : "😴 Start Now"}
          </h2>
        </div>
      </div>

      {/* 🔥 HEATMAP */}
      <div className="max-w-5xl mx-auto mb-10">
        <Heatmap />
      </div>

      {/* Habits */}
      {habits.length === 0 ? (
        <p className="text-center text-gray-500">No habits yet</p>
      ) : (
        <>
        <div className="grid gap-6 max-w-2xl mx-auto">
          {habits.map((habit) => (
            <HabitCard
              key={habit._id}
              habit={habit}
              refreshHabits={fetchHabits} 
            />
          ))}
        </div>
        <div className="max-w-4xl mx-auto mt-10">
      <ProgressChart habits={habits} />
    </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;