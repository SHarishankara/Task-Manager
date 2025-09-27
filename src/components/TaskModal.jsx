import React, { useState, useEffect, useRef } from "react";

export default function TaskModal({ onClose, onSave, task, categories, priorities }) {
  const [values, setValues] = useState(
    task || {
      title: "",
      description: "",
      status: "todo",
      category: categories[0],
      priority: priorities[1]
    }
  );
  const [error, setError] = useState("");
  const ref = useRef(null);

  useEffect(() => {
    setTimeout(() => ref.current && ref.current.focus(), 200);
  }, []);

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!values.title.trim()) {
      setError("Task title is required!");
      return;
    }
    setError("");
    onSave(values);
  }

  return (
    <div className="nrt-modal-overlay" onClick={onClose}>
      <div
        className="nrt-modal"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        role="dialog"
      >
        <h3>{task ? "Edit Task" : "New Task"}</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input
              ref={ref}
              name="title"
              value={values.title}
              onChange={handleChange}
              maxLength={60}
              autoComplete="off"
              required
            />
          </label>
          <label>
            Description
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              maxLength={200}
              rows={2}
            />
          </label>
          <label>
            Category
            <select name="category" value={values.category} onChange={handleChange}>
              {categories.map((cat) => (
                <option value={cat} key={cat}>{cat}</option>
              ))}
            </select>
          </label>
          <label>
            Priority
            <select name="priority" value={values.priority} onChange={handleChange}>
              {priorities.map((p) => (
                <option value={p} key={p}>{p}</option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select name="status" value={values.status} onChange={handleChange}>
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </label>

          {error && <div className="nrt-error">{error}</div>}

          <div className="nrt-modal-actions">
            <button type="submit" className="nrt-btn nrt-btn-save">
              {task ? "Save Changes" : "Add Task"}
            </button>
            <button type="button" className="nrt-btn nrt-btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}