/*
● Configurar servidor Express con CORS y middleware JSON
● Implementar endpoint GET /api/tasks que retorne todas las tareas
● Implementar endpoint POST /api/tasks para crear nuevas tareas
● Implementar endpoint PUT /api/tasks/:id para actualizar tareas existentes
● Implementar endpoint DELETE /api/tasks/:id para eliminar tareas
● Estructura de tarea: { id, title, completed }
● Manejo de errores: Respuestas apropiadas para recursos no encontrados
*/

const express = require("express");
const createError = require("http-errors");
const fs = require("fs/promises");
const path = require("path");
const tasksRouter = express.Router();

// Ruta absoluta al archivo JSON de tareas
const filePath = path.join(__dirname, "../data_tasks.json");

// Función auxiliar para leer el archivo JSON
const leerTasks = async () => {
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
};

// Función auxiliar para guardar el array actualizado de tareas en el archivo JSON
const guardarTasks = async (tasks) => {
  await fs.writeFile(filePath, JSON.stringify(tasks, null, 2));
};

// GET /api/tasks - Listar todas las tareas
tasksRouter.get("/", async (req, res, next) => {
  leerTasks()
    .then((tasks) => res.json(tasks))
    .catch((err) => next(createError(500, "Error al leer las tareas")));
});

// POST /api/tasks - Crear nueva tarea
tasksRouter.post("/", async (req, res, next) => {
  const { title } = req.body;
  if (!title) {
    return next(createError(400, "Falta el título de la tarea"));
  }
  leerTasks()
    .then((tasks) => {
      const nuevaTask = {
        id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
        title,
        completed: false,
      };
      tasks.push(nuevaTask);
      return guardarTasks(tasks).then(() => res.status(201).json(nuevaTask));
    })
    .catch((err) => next(createError(500, "Error al guardar la nueva tarea")));
});

// PUT /api/tasks/:id - Actualizar tarea existente
tasksRouter.put("/:id", async (req, res, next) => {
  const id = parseInt(req.params.id);
  const { title, completed } = req.body;
  leerTasks()
    .then((tasks) => {
      const task = tasks.find((t) => t.id === id);
      if (!task)
        return next(createError(404, "La tarea solicitada no existe"));
      if (title !== undefined) task.title = title;
      if (completed !== undefined) task.completed = completed;
      return guardarTasks(tasks).then(() => res.json(task));
    })
    .catch((err) => next(createError(500, "Error al actualizar la tarea")));
});

// DELETE /api/tasks/:id - Eliminar tarea
tasksRouter.delete("/:id", async (req, res, next) => {
  const id = parseInt(req.params.id);
  leerTasks()
    .then((tasks) => {
      const index = tasks.findIndex((t) => t.id === id);
      if (index === -1)
        return next(createError(404, "La tarea solicitada no existe"));
      const eliminada = tasks.splice(index, 1)[0];
      return guardarTasks(tasks).then(() => res.json(eliminada));
    })
    .catch((err) => next(createError(500, "Error al eliminar la tarea")));
});

module.exports = tasksRouter;



