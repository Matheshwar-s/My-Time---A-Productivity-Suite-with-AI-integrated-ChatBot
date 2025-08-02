import { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import FilterControls from "./FilterControls";
import CalendarView from "./CalendarView";
import Sidebar from "../components/Sidebar";
import ProfileDropdown from "../components/ProfileDropdown";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({ status: "", category: "", date: "" });
  const [userImage, setUserImage] = useState(null);
  const [showForm, setShowForm] = useState(false); // ⬅️ Toggle form
  const email = localStorage.getItem("email");

  useEffect(() => {
    fetchTasks();
    fetchProfile();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:8080/api/tasks");
    setTasks(res.data);
  };

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/user/profile?email=${email}`);
      if (res.data.profileImage) {
        setUserImage(`data:image/jpeg;base64,${res.data.profileImage}`);
      }
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };

  const addTask = async (task) => {
    await axios.post("http://localhost:8080/api/tasks", task);
    fetchTasks();
    setShowForm(false); // ⬅️ Hide after adding
  };

  const updateTask = async (id, task) => {
    await axios.put(`http://localhost:8080/api/tasks/${id}`, task);
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:8080/api/tasks/${id}`);
    fetchTasks();
  };

  const toggleComplete = async (id) => {
    await axios.patch(`http://localhost:8080/api/tasks/${id}/complete`);
    fetchTasks();
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filters.status ? task.status === filters.status : true;
    const matchesCategory = filters.category ? task.category === filters.category : true;
    const matchesDate = filters.date ? task.dueDate === filters.date : true;
    return matchesStatus && matchesCategory && matchesDate;
  });

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-950 to-black text-white">
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 mt-5 mx-4 flex justify-between items-center px-6 py-4 bg-gradient-to-r from-indigo-900 to-indigo-600 shadow-md rounded-xl">
          <h1 className="ml-14 text-xl font-bold hover:text-purple-200 transition flex items-center gap-2">
            <Sidebar />
            <a href="/home">📝 Task Manager</a>
          </h1>
          {userImage ? (
            <img
              src={userImage}
              alt="User"
              className="w-10 h-10 rounded-full border-2 border-white object-cover"
            />
          ) : (
            <ProfileDropdown />
          )}
        </header>

        {/* Spacer below header */}
        <div className="h-[92px]" />

        {/* Main content */}
        <main className="mt-10 px-6 pb-8 space-y-6 overflow-y-auto">
          <div className="flex justify-end">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition"
            >
              {showForm ? "Cancel" : "Add Task"}
            </button>
          </div>

          {showForm && (
            <div>
              <TaskForm onSubmit={addTask} />
            </div>
          )}

          <FilterControls filters={filters} setFilters={setFilters} />
          <TaskList
            tasks={filteredTasks}
            onDelete={deleteTask}
            onToggle={toggleComplete}
            onUpdate={updateTask}
          />
          <CalendarView tasks={tasks} />
        </main>
      </div>
    </div>
  );
}
