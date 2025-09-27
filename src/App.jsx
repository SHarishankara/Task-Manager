import { useState, useEffect, useCallback } from "react";
import TaskBoard from "./components/TaskBoard";
import FilterBar from "./components/FilterBar";
import TaskModal from "./components/TaskModal";
import LoadingSpinner from "./components/LoadingSpinner";

// Initial loading state for demo effect
const LOADING_TIME = 700; // ms

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, task: null });
  const [filter, setFilter] = useState({
    search: "",
    status: "all",
    category: "all",
    priority: "all",
    sort: "date"
  });

  // Load from localStorage
  useEffect(() => {
    setTimeout(() => {
      const data = localStorage.getItem("nrt-tasks");
      if (data) setTasks(JSON.parse(data));
      setLoading(false);
    }, LOADING_TIME);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!loading) localStorage.setItem("nrt-tasks", JSON.stringify(tasks));
  }, [tasks, loading]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === "n") {
        e.preventDefault();
        setModal({ open: true, task: null });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // CRUD Handlers
  const addTask = (task) => {
    setTasks((prev) => [
      ...prev,
      { ...task, id: Date.now().toString(), created: new Date().toISOString() }
    ]);
  };
  const updateTask = (id, updates) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };
  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };
  const reorderTasks = (tasksArr) => setTasks(tasksArr);
    // Categories/priorities for dropdowns
  const categories = ["Work", "Chores", "Training", "Mission", "Personal", "Other"];
  const priorities = ["High", "Medium", "Low"];


  // Filtering/sorting/search
  const getFilteredTasks = useCallback(() => {
    let filtered = [...tasks];
    if (filter.status !== "all") {
      filtered = filtered.filter((t) => t.status === filter.status);
    }
    if (filter.category !== "all") {
      filtered = filtered.filter((t) => t.category === filter.category);
    }
    if (filter.priority !== "all") {
      filtered = filtered.filter((t) => t.priority === filter.priority);
    }
    if (filter.search) {
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(filter.search.toLowerCase()) ||
          t.description.toLowerCase().includes(filter.search.toLowerCase())
      );
    }
    // Sorting
    switch (filter.sort) {
      case "priority":
        filtered.sort((a, b) => priorities.indexOf(a.priority) - priorities.indexOf(b.priority));
        break;
      case "date":
        filtered.sort((a, b) => new Date(b.created) - new Date(a.created));
        break;
      default:
        break;
    }
    return filtered;
  }, [tasks, filter]);


  if (loading) return <LoadingSpinner text="Loading tasks" />;

  return (
    <div className="nrt-bg">
      <header className="nrt-header">
        <img src="/headerimg.jpg" alt="Naruto Headband" className="nrt-logo" />
        <h1 className="nrt-title">Task Manager</h1>
        <span className="nrt-subtitle">🍥Manage your tasks below🍥</span>
      </header>
          <button
      className="nrt-btn nrt-btn-add"
      style={{ margin: "1rem 2rem", color : "#fff", backgroundColor: "#ff9900", border: "2px solid #fff", fontWeight: "bold" }}
      onClick={() => setModal({ open: true, task: null })}
    >
      + Add Task
    </button>

      <FilterBar
        filter={filter}
        setFilter={setFilter}
        categories={categories}
        priorities={priorities}
      />
      <TaskBoard
        tasks={getFilteredTasks()}
        onEdit={(task) => setModal({ open: true, task })}
        onDelete={deleteTask}
        onReorder={reorderTasks}
        updateTask={updateTask}
        categories={categories}
        priorities={priorities}
      />
      {modal.open && (
        <TaskModal
          onClose={() => setModal({ open: false, task: null })}
          onSave={modal.task ? (t) => { updateTask(modal.task.id, t); setModal({ open: false, task: null }); }
            : (t) => { addTask(t); setModal({ open: false, task: null }); }}
          task={modal.task}
          categories={categories}
          priorities={priorities}
        />
      )}
      <footer className="nrt-footer">
        <p>Made by <a href = "https://www.linkedin.com/in/harishankara-s/">Hari</a></p>
      </footer>
    </div>
  );
}