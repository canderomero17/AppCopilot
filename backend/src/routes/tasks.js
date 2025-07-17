const express = require('express');
const router = express.Router();
const Task = require('../models/task'); 
let tasks = [];

// GET /tasks - Recuperar todas las tareas
router.get('/', (req, res) => {
    res.json(tasks);
});

// POST /tasks - Crear una nueva tarea
router.post('/', (req, res) => {
    const { title, description, dueDate, priority } = req.body;
    if (!title) {
        return res.status(400).json({ message: 'El título es requerido' });
    }
    const newTask = new Task({title, description, dueDate, priority});
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PUT /tasks/:id - Actualizar una tarea existente
router.put('/:id', (req, res) => {
    const { id } = req.params;
    console.log('ID recibido:', id);
    console.log('IDs en memoria:', tasks.map(t => t.id));

    const { title, description, dueDate, priority, status } = req.body;
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        title: title !== undefined ? title : tasks[taskIndex].title,
        description: description !== undefined ? description : tasks[taskIndex].description,
        dueDate: dueDate !== undefined ? dueDate : tasks[taskIndex].dueDate,
        priority: priority !== undefined ? priority : tasks[taskIndex].priority,
        status: status !== undefined ? status : tasks[taskIndex].status
    };

    res.json(tasks[taskIndex]);
});

// GET /tasks/:id - Obtener una tarea por su ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.json(task);
});

// DELETE /tasks/:id - Eliminar una tarea
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id !== id);

    if (tasks.length === initialLength) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.status(204).send(); // No Content
});



module.exports = router;