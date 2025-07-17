<!-- README GENERADO CON COPILOT -->

## Documentación General del Proyecto

### Descripción
Aplicación de gestión de tareas con backend en Node.js (Express) y frontend en JavaScript. Permite crear, listar, actualizar y eliminar tareas, con almacenamiento en memoria.

---

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/CursoIA.git
   cd CursoIA
   ```

2. Instala las dependencias del backend y frontend:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

---

## Ejecución

### Backend
1. Ve al directorio del backend:
   ```bash
   cd backend
   ```
2. Inicia el servidor:
   ```bash
   npm start
   ```
   El backend estará disponible en `http://localhost:3000`.

### Frontend
1. Ve al directorio del frontend:
   ```bash
   cd frontend
   ```
2. Inicia el servidor de desarrollo:
   ```bash
   npm start
   ```
   El frontend estará disponible en `http://localhost:3000` (o el puerto configurado).

---

## Estructura del Proyecto

```
CursoIA/
├── backend/
│   ├── package.json
│   ├── src/
│   │   ├── app.js
│   │   ├── models/
│   │   │   └── task.js
│   │   └── routes/
│   │       └── tasks.js
├── frontend/
│   ├── package.json
│   ├── public/
│   │   ├── index.html
│   │   └── style.css
│   └── src/
│       └── app.js
└── README.md
```

---

## Uso de la Aplicación

### API REST (Backend)

Puedes interactuar con la API usando herramientas como [Postman](https://www.postman.com/) o [curl](https://curl.se/).

- **GET /tasks**: Obtiene la lista de tareas.
- **POST /tasks**: Crea una nueva tarea. Envía un objeto JSON con los campos requeridos.
- **PUT /tasks/:id**: Actualiza una tarea existente por ID.
- **DELETE /tasks/:id**: Elimina una tarea por ID.

#### Ejemplo de creación de tarea (POST /tasks)
```json
{
  "title": "Comprar pan",
  "description": "Ir a la panadería",
  "dueDate": "2025-07-20",
  "priority": "Medio",
  "status": "Pendiente"
}
```

#### Ejemplo de petición con curl
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Comprar pan","priority":"Medio","status":"Pendiente"}'
```

---

### Interfaz Web (Frontend)

Accede a `http://localhost:3000` en tu navegador para gestionar las tareas desde la interfaz web.

---

## Requisitos

- Node.js >= 14
- npm >= 6

---

## Notas

- El almacenamiento de tareas es en memoria, por lo que los datos se pierden al reiniciar el servidor.
- Puedes modificar los archivos en `src/models` y `src/routes` para personalizar la lógica de negocio.

---


<!-- DETALLES DE COMO FUE EL PROCESO PARA REALIZAR LA APP -->
Para armar la estructura del proyecto utilice gemini.

Para hacer task.js le envie el siguiente prompt a copilot:
"Defini una estructura de objeto Task con id (uuid), title (sting), desciption(string, opcional), dueDate (string, formato fecha, opcional), priority (string: "Bajo", "Medio", "Alto"), status (string, "Pendiente","Completado"). Tene en cuenta que no tengo bdd, tendre una base de datos en memoria." y funcionó perfecto.

"Cree un enrutador Express para tareas con almacenamiento en memoria. Inclui GET /tasks, POST /tasks, PUT /tasks/:id, DELETE /tasks/:id endpoints. Usa la clase Task."
Para crear las rutas envie ese prompt pero encontre varios detalles a ajustar. Por ejemplo uno de ellos fue: declaro const tasks = [] y debe ser un let para poder reasignar la variable. Tambien encontre varios respecto a las peticiones, por eso para este archivo decidi usar la respuesta que me dio gemini.
Luego de ese archivo, el ultimo de backend lo hice con gemini ya que copilot no me dio confianza.

Para la generación del html del front le mande como contexto el archivo tasks donde tenia el constructor y la respuesta me parecio ok.

Conclusion: si bien me parece una buena herramienta y que va a ir mejorando, por el momento me parecieron mejores las respuestas de gemini y chatGPT. No descarto usarla en un futuro, pero por ahora seguire con las que ya venia usando.