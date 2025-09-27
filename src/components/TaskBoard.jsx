import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

const statusColumns = [
  { id: "todo", title: "To Do" },
  { id: "inprogress", title: "In Progress" },
  { id: "done", title: "Done" }
];

function groupByStatus(tasks) {
  return statusColumns.reduce((acc, col) => {
    acc[col.id] = tasks.filter((t) => t.status === col.id);
    return acc;
  }, {});
}

export default function TaskBoard({
  tasks,
  onEdit,
  onDelete,
  onReorder,
  updateTask,
  categories,
  priorities
}) {
  const columns = groupByStatus(tasks);

  function onDragEnd(result) {
    if (!result.destination) return;

    // Reorder within or move between columns
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) {
      // Reorder within the same column
      const reordered = [...columns[source.droppableId]];
      const [removed] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, removed);

      // Update global order
      const newTasks = [];
      statusColumns.forEach((col) => {
        if (col.id === source.droppableId) {
          newTasks.push(...reordered);
        } else {
          newTasks.push(...columns[col.id]);
        }
      });
      onReorder(newTasks);
    } else {
      // Move to another status
      const sourceTasks = [...columns[source.droppableId]];
      const [removed] = sourceTasks.splice(source.index, 1);
      removed.status = destination.droppableId;
      const destTasks = [...columns[destination.droppableId]];
      destTasks.splice(destination.index, 0, removed);

      // Update global order
      const newTasks = [];
      statusColumns.forEach((col) => {
        if (col.id === source.droppableId) newTasks.push(...sourceTasks);
        else if (col.id === destination.droppableId) newTasks.push(...destTasks);
        else newTasks.push(...columns[col.id]);
      });
      onReorder(newTasks);
      updateTask(removed.id, { status: destination.droppableId });
    }
  }

  return (
    <main className="nrt-board">
      <DragDropContext onDragEnd={onDragEnd}>
        {statusColumns.map((col) => (
          <Droppable droppableId={col.id} key={col.id}>
            {(provided) => (
              <section
                className={`nrt-column nrt-column-${col.id}`}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <h2 className="nrt-col-title">{col.title}</h2>
                {columns[col.id].length === 0 && (
                  <div className="nrt-empty">No tasks</div>
                )}
                {columns[col.id].map((task, idx) => (
                  <Draggable draggableId={task.id} index={idx} key={task.id}>
                    {(provided, snapshot) => (
                      <div
                        className="nrt-draggable"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          boxShadow: snapshot.isDragging
                            ? "0 2px 12px #f6a40088"
                            : "none"
                        }}
                      >
                        <TaskCard
                          task={task}
                          onEdit={() => onEdit(task)}
                          onDelete={() => onDelete(task.id)}
                          categories={categories}
                          priorities={priorities}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </section>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </main>
  );
}