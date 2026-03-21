import { useEffect, useState } from "react";
import API from "../services/api";

function Leaderboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await API.get("/users/leaderboard");
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-6 text-white">
    
    <h1 className="text-3xl font-bold text-center mb-8">🏆 Leaderboard</h1>

    <div className="max-w-xl mx-auto space-y-4">
      {users.map((user, index) => (
        <div
          key={user._id}
          className={`flex justify-between items-center p-4 rounded-xl shadow-lg backdrop-blur-lg border border-white/20
          ${index === 0 ? "bg-yellow-500/20" : "bg-white/10"}`}
        >
          <span className="font-semibold text-lg">
            {index === 0
              ? "🥇"
              : index === 1
              ? "🥈"
              : index === 2
              ? "🥉"
              : `#${index + 1}`}{" "}
            {user.name}
          </span>

          <span className="text-yellow-400 font-bold">
            {user.xp} XP
          </span>
        </div>
      ))}
    </div>

  </div>
);
}

export default Leaderboard;