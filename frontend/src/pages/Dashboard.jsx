import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const StatCard = ({ label, value, color }) => (
  <div className={`bg-white p-6 rounded-xl shadow border-l-4 ${color}`}>
    <p className="text-gray-500 text-sm">{label}</p>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({ tasks: [], stats: {} });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.get("/tasks/my-tasks")
      .then(({ data }) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  if (loading) return <div className="p-8">Loading dashboard...</div>;
  const { stats, tasks } = data;
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Hello, {user?.name} 👋</h1>
      <p className="text-gray-600 mb-6">Here's your task overview</p>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard label="Total Tasks" value={stats.total || 0} color="border-blue-500" />
        <StatCard label="To Do" value={stats.todo || 0} color="border-gray-500" />
        <StatCard label="In Progress" value={stats.inProgress || 0} color="border-yellow-500" />
        <StatCard label="Done" value={stats.done || 0} color="border-green-500" />
        <StatCard label="Overdue" value={stats.overdue || 0} color="border-red-500" />
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">My Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-gray-500">No tasks assigned to you.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="p-3">Title</th><th className="p-3">Project</th>
                  <th className="p-3">Priority</th><th className="p-3">Status</th>
                  <th className="p-3">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => {
                  const overdue = t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "Done";
                  return (
                    <tr key={t._id} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{t.title}</td>
                      <td className="p-3 text-sm text-gray-600">{t.project?.name}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs ${t.priority === "High" ? "bg-red-100 text-red-700" : t.priority === "Medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="p-3 text-sm">{t.status}</td>
                      <td className={`p-3 text-sm ${overdue ? "text-red-600 font-semibold" : ""}`}>
                        {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—"}{overdue && " ⚠️"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
