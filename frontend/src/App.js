import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AddHabit from "./pages/AddHabit";
import Profile from "./pages/Profile";
import { Navigate } from "react-router-dom";
import Leaderboard from "./pages/Leaderboard";
import Charts from "./pages/Charts";

function App() {
  const token = localStorage.getItem("token");
  return (
    <Router>
      <Routes>

        {/* 🔓 Public Routes */}
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/" />} // 🔥 FIX
        />
        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/" />} // 🔥 FIX
        />

        {/* 🔐 Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* 🔥 FIX: Protect these routes */}
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddHabit />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/charts" element={<Charts />} />

      </Routes>
    </Router>
  );
}

export default App;