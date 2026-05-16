import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import ProjectModal from "../components/ProjectModal";
import toast from "react-hot-toast";

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try { const { data } = await api.get("/projects"); setProjects(data); }
    catch (err) { toast.error("Failed to load projects"); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this project and all its tasks?")) return;
    try { await api.delete(`/projects/${id}`); toast.success("Project deleted"); fetchProjects(); }
    catch (err) { toast.error(err.response?.data?.message || "Delete failed"); }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        {user?.role === "Admin" && (
          <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">+ New Project</button>
        )}
      </div>
      {projects.length === 0 ? (
        <div className="bg-white p-12 rounded-xl text-center text-gray-500">
          No projects yet. {user?.role === "Admin" && "Create your first project!"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div key={p._id} className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                {user?.role === "Admin" && (
                  <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-700 text-sm">🗑️</button>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{p.description || "No description"}</p>
              <div className="text-xs text-gray-500 mb-3">👥 {p.members?.length || 0} members</div>
              <Link to={`/projects/${p._id}`} className="block text-center bg-indigo-50 text-indigo-600 py-2 rounded hover:bg-indigo-100">View Tasks →</Link>
            </div>
          ))}
        </div>
      )}
      {showModal && <ProjectModal onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); fetchProjects(); }} />}
    </div>
  );
}
