import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import TaskModal from "../components/TaskModal";
import toast from "react-hot-toast";

export default function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const fetchAll = async () => {
    try {
      const [p, t] = await Promise.all([api.get(`/projects/${id}`), api.get(`/tasks?project=${id}`)]);
      setProject(p.data); setTasks(t.data);
    } catch (err) { toast.error("Failed to load"); }
  };
  useEffect(() => { fetchAll(); }, [id]);

  const updateStatus = async (taskId, status) => {
    try { await api.put(`/tasks/${taskId}`, { status }); toast.success("Status updated"); fetchAll(); }
    catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const deleteTask = async (taskId) => {
    if (!confirm("Delete this task?")) return;
    try { await api.delete(`/tasks/${taskId}`); toast.success("Task deleted"); fetchAll(); }
    catch (err) { toast.error("Failed"); }
  };

  if (!project) return <div className="p-8">Loading...</div>;
  const columns = ["Todo", "In Progress", "Done"];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-gray-600 mt-1">{project.description}</p>
            <p className="text-sm text-gray-500 mt-2">👥 {project.members?.map((m) => m.name).join(", ") || "No members"}</p>
          </div>
          {user?.role === "Admin" && (
            <button onClick={() => { setEditTask(null); setShowModal(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">+ New Task</button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => (
          <div key={col} className="bg-gray-100 rounded-xl p-4">
            <h3 className="font-semibold mb-3 flex justify-between">
              {col}
              <span className="bg-gray-300 px-2 rounded-full text-sm">{tasks.filter((t) => t.status === col).length}</span>
            </h3>
            <div className="space-y-3">
              {tasks.filter((t) => t.status === col).map((t) => {
                const overdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "Done";
                return (
                  <div key={t._id} className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{t.title}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded ${t.priority === "High" ? "bg-red-100 text-red-700" : t.priority === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                        {t.priority}
                      </span>
                    </div>
                    {t.description && <p className="text-sm text-gray-600 mt-1">{t.description}</p>}
                    <div className="text-xs text-gray-500 mt-2">👤 {t.assignedTo?.name || "Unassigned"}</div>
                    {t.dueDate && (
                      <div className={`text-xs mt-1 ${overdue ? "text-red-600 font-semibold" : "text-gray-500"}`}>
                        📅 {new Date(t.dueDate).toLocaleDateString()} {overdue && "⚠️"}
                      </div>
                    )}
                    <div className="flex gap-2 mt-2">
                      <select value={t.status} onChange={(e) => updateStatus(t._id, e.target.value)} className="text-xs border rounded px-1 py-0.5 flex-1">
                        {columns.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {user?.role === "Admin" && (
                        <>
                          <button onClick={() => { setEditTask(t); setShowModal(true); }} className="text-xs px-2 bg-blue-50 text-blue-600 rounded">✏️</button>
                          <button onClick={() => deleteTask(t._id)} className="text-xs px-2 bg-red-50 text-red-600 rounded">🗑️</button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <TaskModal projectId={id} task={editTask} onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); fetchAll(); }} />
      )}
    </div>
  );
}
