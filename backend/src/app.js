const express = require('express');
const cors = require('cors'); 
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Habilita CORS para permitir solicitudes desde el frontend
app.use(express.json()); // Middleware para parsear el body de las solicitudes como JSON

// Monta el router de tareas
app.use('/api/tasks', tasksRouter);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de Lista de Tareas funcionando!');
});

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});