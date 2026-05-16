import { useEffect, useState } from "react";
import api from "../api/axios";
import toast from "react-hot-toast";
export default function ProjectModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({ name: "", description: "", members: [] });
  const [users, setUsers] = useState([]);
  useEffect(() => { api.get("/auth/users").then(({ data }) => setUsers(data)); }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await api.post("/projects", form); toast.success("Project created"); onSuccess(); }
    catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };
  const toggleMember = (id) => {
    setForm((f) => ({ ...f, members: f.members.includes(id) ? f.members.filter((m) => m !== id) : [...f.members, id] }));
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">New Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Project name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg" required />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg" rows={3} />
          <div>
            <p className="text-sm font-medium mb-2">Add Members:</p>
            <div className="max-h-40 overflow-y-auto border rounded-lg p-2 space-y-1">
              {users.map((u) => (
                <label key={u._id} className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded cursor-pointer">
                  <input type="checkbox" checked={form.members.includes(u._id)} onChange={() => toggleMember(u._id)} />
                  <span className="text-sm">{u.name} ({u.email})</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 border rounded-lg">Cancel</button>
            <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white rounded-lg">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
