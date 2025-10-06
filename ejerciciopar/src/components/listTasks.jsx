import { useState, useEffect } from "react";

function TasksList() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
    try {
      const respuesta = await fetch('http://localhost:4000/api/tasks');
      const arregloTasks = await respuesta.json();
      setTasks(arregloTasks); 
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  fetchTasks();
  }, []);

  return(
    <div>
      <h1>Lista de tareas</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>Estado: {task.complete ? '✅ Completada' : '❌ Pendiente'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksList;