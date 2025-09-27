import React from "react";

export default function TaskCard({ task, onEdit, onDelete }) {
  return (
    <div className={`nrt-taskcard nrt-priority-${task.priority.toLowerCase()}`}>
      <div className="nrt-taskcard-top">
        <span className="nrt-task-title">{task.title}</span>
        <span className={`nrt-task-status nrt-status-${task.status}`}>{{
          todo: "",
          inprogress: "",
          done: ""
        }[task.status]}</span>
      </div>
      <div className="nrt-task-desc">{task.description}</div>
      <div className="nrt-task-meta">
        <span className="nrt-task-cat">{task.category}</span>•
        <span className={`nrt-task-prio nrt-priority-${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
      </div>
      <div className="nrt-task-actions">
        <button className="nrt-btn nrt-btn-edit" onClick={onEdit} title="Edit">
          🖊️
        </button>
        <button className="nrt-btn nrt-btn-del" onClick={onDelete} title="Delete">
          🚮
        </button>
      </div>
    </div>
  );
}