import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TaskList({ tasks, onDelete, onToggle, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditForm(task);
  };

  const handleChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    onUpdate(editingId, editForm);
    setEditingId(null);
  };

  const getStatusBadge = (status) => {
    const colors = {
      TODO: "bg-gray-500",
      IN_PROGRESS: "bg-yellow-500",
      DONE: "bg-green-500",
    };
    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded ${colors[status] || "bg-gray-400"} text-white`}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="border border-gray-600 bg-white/10 rounded-lg p-4 flex flex-col sm:flex-row justify-between sm:items-center text-white shadow-md"
          >
            {editingId === task.id ? (
              <div className="flex-1 space-y-2">
                <input
                  name="title"
                  value={editForm.title}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-100 text-black"
                  placeholder="Title"
                />
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-100 text-black"
                  placeholder="Description"
                />
                <input
                  type="date"
                  name="dueDate"
                  value={editForm.dueDate}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-100 text-black"
                />
                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-100 text-black"
                >
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="DONE">DONE</option>
                </select>
                <button
                  onClick={handleUpdate}
                  className="mt-2 px-4 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex-1 space-y-1">
                <h3
                  className={`text-lg font-bold ${
                    task.status === "DONE" ? "line-through text-gray-400" : ""
                  }`}
                >
                  {task.title}
                </h3>
                <p
                  className={`text-sm ${
                    task.status === "DONE" ? "line-through text-gray-400" : ""
                  }`}
                >
                  {task.description}
                </p>
                <div className="flex items-center justify-between text-sm mt-1">
                  <p className="text-gray-300">Due: {task.dueDate}</p>
                  {getStatusBadge(task.status)}
                </div>
              </div>
            )}

            <div className="flex space-x-2 mt-4 sm:mt-0 sm:ml-4">
              <button
                onClick={() => onToggle(task.id)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                title="Toggle Complete"
              >
                ✓
              </button>
              <button
                onClick={() => startEditing(task)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                title="Edit"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
