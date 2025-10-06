import { useEffect, useState } from "react";
import "./App.css";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import Feedback from "./components/Feedback";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar tareas al iniciar
  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Error al cargar tareas");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError("No se pudieron cargar las tareas");
    } finally {
      setLoading(false);
    }
  }

  // Crear tarea
  async function addTask(title) {
    if (!title.trim()) {
      alert("La tarea no puede estar vacía");
      return;
    }

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, completed: false }),
      });
      if (!res.ok) throw new Error("Error al crear tarea");
      const newTask = await res.json();
      setTasks([newTask, ...tasks]);
    } catch {
      setError("Error al crear la tarea");
    }
  }

  // Marcar como completada
  async function toggleTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const updated = { ...task, completed: !task.completed };
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      setTasks(tasks.map((t) => (t.id === id ? data : t)));
    } catch {
      setError("Error al actualizar tarea");
    }
  }

  // Eliminar tarea
  async function deleteTask(id) {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setTasks(tasks.filter((t) => t.id !== id));
    } catch {
      setError("Error al eliminar tarea");
    }
  }

  //Para el Listado
}

export default App;
