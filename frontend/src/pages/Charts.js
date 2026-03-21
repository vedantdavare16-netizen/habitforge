import { useEffect, useState } from "react";
import API from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

function Charts() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const res = await API.get("/habits");

      // ✅ FIX: handle empty names
      const chartData = res.data.map((habit) => ({
        name: habit.name || "Unnamed",
        streak: habit.currentStreak,
      }));

      setData(chartData);
    } catch (error) {
      console.log(error);
    }
  };

 return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6 text-white">
    
    <h1 className="text-3xl font-bold text-center mb-8">
      📊 Habit Progress
    </h1>

    <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-lg">
      
      <BarChart
        width={700}
        height={350}
        data={data}
        style={{ margin: "auto" }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#ccc" />
        <YAxis stroke="#ccc" />
        <Tooltip />
        <Bar dataKey="streak" fill="#3b82f6" />
      </BarChart>

    </div>
  </div>
);
}

export default Charts;