import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
export default function TaskModal({ projectId, task, onClose, onSuccess }) {
  const [form, setForm] = useState({
    title: task?.title || "", description: task?.description || "",
    assignedTo: task?.assignedTo?._id || "", status: task?.status || "Todo",
    priority: task?.priority || "Medium", dueDate: task?.dueDate ? task.dueDate.split("T")[0] : "",
  });
  const [users, setUsers] = useState([]);
  useEffect(() => { api.get("/auth/users").then(({ data }) => setUsers(data)); }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (task) { await api.put(`/tasks/${task._id}`, form); toast.success("Task updated"); }
      else { await api.post("/tasks", { ...form, project: projectId }); toast.success("Task created"); }
      onSuccess();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{task ? "Edit" : "New"} Task</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg" required />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg" rows={3} />
          <select value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
            <option value="">Unassigned</option>
            {users.map((u) => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="px-4 py-2 border rounded-lg">
              <option>Todo</option><option>In Progress</option><option>Done</option>
            </select>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="px-4 py-2 border rounded-lg">
              <option>Low</option><option>Medium</option><option>High</option>
            </select>
          </div>
          <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 border rounded-lg">Cancel</button>
            <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg">{task ? "Update" : "Create"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
