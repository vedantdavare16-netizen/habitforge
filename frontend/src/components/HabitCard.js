import { useState } from "react";
import Confetti from "react-confetti";
import API from "../services/api";

function HabitCard({ habit, refreshHabits }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showXP, setShowXP] = useState(false);

  const handleComplete = async () => {
    try {
      await API.post(`/habits/${habit._id}/complete`);

      // 🎉 Trigger confetti
      setShowConfetti(true);

      // 🔥 SHOW XP POPUP
      setShowXP(true);

      // Auto hide after 2 sec
      setTimeout(() => {
        setShowConfetti(false);
        setShowXP(false);
      }, 2000);

      refreshHabits();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/habits/${habit._id}`);
      refreshHabits();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* 🎉 Confetti (full screen) */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
        />
      )}

      <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 p-5 rounded-2xl shadow-lg flex justify-between items-center hover:scale-[1.02] transition">

        {/* 🔥 XP POPUP */}
        {showXP && (
          <div className="absolute -top-3 right-2 bg-green-500 text-white px-3 py-1 rounded-lg shadow-lg text-sm font-semibold animate-bounce">
            🎉 +10 XP
          </div>
        )}

        {/* Left */}
        <div>
          <h2 className="text-xl font-semibold">{habit.name}</h2>

          <p className="text-gray-300 mt-1">
            🔥 Streak: {habit.currentStreak} days
          </p>

          <span className="inline-block mt-2 text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded">
            {habit.frequency}
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center">
          <button
            onClick={handleComplete}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg shadow-md transition"
          >
            ✔ Complete
          </button>

          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg shadow-md transition ml-2"
          >
            🗑 Delete
          </button>
        </div>
      </div>
    </>
  );
}

export default HabitCard;