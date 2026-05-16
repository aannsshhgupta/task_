import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/login"); };
  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">📋 TaskFlow</Link>
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:text-indigo-200">Dashboard</Link>
          <Link to="/projects" className="hover:text-indigo-200">Projects</Link>
          <span className="bg-indigo-800 px-3 py-1 rounded-full text-sm">{user?.name} ({user?.role})</span>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm">Logout</button>
        </div>
      </div>
    </nav>
  );
}
