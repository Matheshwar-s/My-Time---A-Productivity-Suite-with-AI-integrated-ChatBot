import { useState } from "react";

export default function TaskForm({ onSubmit }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "LOW",
    status: "TODO",
    category: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({
      title: "",
      description: "",
      dueDate: "",
      priority: "LOW",
      status: "TODO",
      category: "",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white/10 text-white p-4 rounded-lg shadow-md"
    >
      <h2 className="text-xl font-semibold mb-2">Create a New Task</h2>

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title *"
        className="border border-gray-600 bg-gray-100 text-black rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="border border-gray-600 bg-gray-100 text-black rounded px-3 py-2 w-full"
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="border border-gray-600 bg-gray-100 text-black rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Priority</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className={`border border-gray-600 bg-gray-100 text-black rounded px-3 py-2 w-full`}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>

      <input
        name="category"
        value={form.category}
        onChange={handleChange}
        placeholder="Category (optional)"
        className="border border-gray-600 bg-gray-100 text-black rounded px-3 py-2 w-full"
      />

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow-md"
      >
        Add Task
      </button>
    </form>
  );
}
