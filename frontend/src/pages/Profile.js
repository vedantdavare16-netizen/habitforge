import { useEffect, useState } from "react";
import API from "../services/api";

function Profile() {

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/profile");
      setProfile(res.data);
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false); 
    }
  };
if (loading || !profile) {
  return <p>Loading...</p>;
}


  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white">
    
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
      
      <h1 className="text-3xl font-bold mb-6">👤 Profile</h1>

      <div className="space-y-3 text-lg">
        <p><span className="text-gray-300">Name:</span> {user.name}</p>
        <p><span className="text-gray-300">XP:</span> {user.xp}</p>
        <p><span className="text-gray-300">Level:</span> {user.level}</p>
        <p><span className="text-gray-300">Total Habits:</span> {user.totalHabits}</p>
        <p><span className="text-gray-300">Completions:</span> {user.totalCompletions}</p>
      </div>

      {/* Badges */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">🏅 Badges</h2>
        {user.badges.length === 0 ? (
          <p className="text-gray-400">No badges yet</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {user.badges.map((badge, index) => (
              <span
                key={index}
                className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>

    </div>
  </div>
);
}

export default Profile;