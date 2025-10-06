import DeleteButton from "./DeleteButton";

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li
      className={`task-item ${task.completed ? "completed" : ""}`}
      onClick={() => onToggle(task.id)}
    >
      <span>{task.title}</span>
      <DeleteButton onDelete={() => onDelete(task.id)} />
    </li>
  );
}
