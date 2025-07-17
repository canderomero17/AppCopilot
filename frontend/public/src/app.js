document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:3000/api/tasks'; 

    const taskForm = document.getElementById('task-form');
    const tasksList = document.getElementById('tasks-list');

    // Función para obtener y renderizar todas las tareas
    async function fetchAndRenderTasks() {
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const tasks = await response.json();
            renderTasks(tasks);
        } catch (error) {
            console.error('Error al obtener las tareas:', error);
            tasksList.innerHTML = '<p>Error al cargar las tareas. Asegúrate de que el backend esté funcionando.</p>';
        }
    }

    // Función para renderizar las tareas en el DOM
    function renderTasks(tasks) {
        tasksList.innerHTML = ''; // Limpiar lista existente
        if (tasks.length === 0) {
            tasksList.innerHTML = '<p>No hay tareas. ¡Añade una nueva!</p>';
            return;
        }

        tasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('task-item');
            if (task.status === 'Completado') {
                taskItem.classList.add('completed');
            }
            taskItem.dataset.id = task.id; // Guarda el ID para futuras operaciones

            taskItem.innerHTML = `
                <h3>${task.title}</h3>
                ${task.description ? `<p>${task.description}</p>` : ''}
                <div class="task-meta">
                    <span>Prioridad: ${task.priority}</span>
                    <span>Fecha límite: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</span>
                    <span>Estado: ${task.status}</span>
                </div>
                <div class="task-actions">
                    <button class="edit-button">Editar</button>
                    ${task.status === 'Pendiente' ?
                        `<button class="complete-button">Completar</button>` :
                        `<button class="pending-button">Marcar Pendiente</button>`
                    }
                    <button class="delete-button">Eliminar</button>
                </div>
            `;
            tasksList.appendChild(taskItem);
        });
    }

    // Manejar el envío del formulario para añadir una nueva tarea
    taskForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-description').value;
        const dueDate = document.getElementById('task-dueDate').value;
        const priority = document.getElementById('task-priority').value;

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description, dueDate, priority })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Limpiar el formulario y recargar las tareas
            taskForm.reset();
            fetchAndRenderTasks();
        } catch (error) {
            console.error('Error al añadir tarea:', error);
            alert('No se pudo añadir la tarea. Revisa la consola para más detalles.');
        }
    });

    // Manejar clics en los botones de editar, completar/pendiente y eliminar
    tasksList.addEventListener('click', async (event) => {
        const target = event.target;
        const taskItem = target.closest('.task-item');
        if (!taskItem) return;

        const taskId = taskItem.dataset.id;

        // Eliminar tarea
        if (target.classList.contains('delete-button')) {
            if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
                try {
                    const response = await fetch(`${API_BASE_URL}/${taskId}`, {
                        method: 'DELETE'
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    fetchAndRenderTasks(); // Recargar la lista después de eliminar
                } catch (error) {
                    console.error('Error al eliminar tarea:', error);
                    alert('No se pudo eliminar la tarea.');
                }
            }
        }

        // Marcar como Completada/Pendiente
        if (target.classList.contains('complete-button') || target.classList.contains('pending-button')) {
            const currentStatus = taskItem.classList.contains('completed') ? 'Completado' : 'Pendiente';
            const newStatus = currentStatus === 'Pendiente' ? 'Completado' : 'Pendiente';

            try {
                const response = await fetch(`${API_BASE_URL}/${taskId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ status: newStatus })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                fetchAndRenderTasks(); // Recargar la lista
            } catch (error) {
                console.error('Error al actualizar estado:', error);
                alert('No se pudo actualizar el estado de la tarea.');
            }
        }

        // Editar tarea
        if (target.classList.contains('edit-button')) {
            toggleEditMode(taskItem, taskId);
        }
    });

    // Función para alternar el modo de edición
    async function toggleEditMode(taskItem, taskId) {
        const isEditing = taskItem.classList.contains('editing');
        const currentTask = (await (await fetch(`${API_BASE_URL}/${taskId}`)).json()); // Obtener la tarea actual para pre-rellenar
        if (!currentTask) return;

        if (isEditing) {
            // Guardar cambios
            const updatedTitle = taskItem.querySelector('.edit-title').value;
            const updatedDescription = taskItem.querySelector('.edit-description').value;
            const updatedDueDate = taskItem.querySelector('.edit-dueDate').value;
            const updatedPriority = taskItem.querySelector('.edit-priority').value;

            try {
                const response = await fetch(`${API_BASE_URL}/${taskId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        title: updatedTitle,
                        description: updatedDescription,
                        dueDate: updatedDueDate,
                        priority: updatedPriority
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                taskItem.classList.remove('editing');
                fetchAndRenderTasks(); // Recargar la lista
            } catch (error) {
                console.error('Error al guardar edición:', error);
                alert('No se pudo guardar la edición de la tarea.');
            }
        } else {
            // Entrar en modo edición
            taskItem.classList.add('editing');

            const titleElem = taskItem.querySelector('h3');
            const descriptionElem = taskItem.querySelector('p');
            const metaElem = taskItem.querySelector('.task-meta');
            const actionsElem = taskItem.querySelector('.task-actions');

            const originalTitle = titleElem.innerText;
            const originalDescription = descriptionElem ? descriptionElem.innerText : '';
            const originalPriority = metaElem.querySelector('span:nth-child(1)').innerText.replace('Prioridad: ', '');
            const originalDueDate = currentTask.dueDate || ''; // Usar la fecha del objeto de tarea para la edición

            titleElem.innerHTML = `<input type="text" class="edit-title" value="${originalTitle}" required>`;
            if (descriptionElem) {
                 descriptionElem.innerHTML = `<textarea class="edit-description">${originalDescription}</textarea>`;
            } else {
                // Si no había descripción, añade un textarea
                const newDescInput = document.createElement('textarea');
                newDescInput.classList.add('edit-description');
                newDescInput.value = originalDescription;
                taskItem.insertBefore(newDescInput, metaElem);
            }
            metaElem.innerHTML = `
                <span>
                    Prioridad:
                    <select class="edit-priority">
                        <option value="Bajo" ${originalPriority === 'Bajo' ? 'selected' : ''}>Bajo</option>
                        <option value="Medio" ${originalPriority === 'Medio' ? 'selected' : ''}>Medio</option>
                        <option value="Alto" ${originalPriority === 'Alto' ? 'selected' : ''}>Alto</option>
                    </select>
                </span>
                <span>
                    Fecha límite:
                    <input type="date" class="edit-dueDate" value="${originalDueDate}">
                </span>
                <span>Estado: ${currentTask.status}</span>
            `;
            actionsElem.innerHTML = `
                <button class="save-button">Guardar</button>
                <button class="cancel-button">Cancelar</button>
            `;

            taskItem.querySelector('.save-button').addEventListener('click', () => toggleEditMode(taskItem, taskId));
            taskItem.querySelector('.cancel-button').addEventListener('click', () => {
                taskItem.classList.remove('editing');
                fetchAndRenderTasks(); // Recargar para descartar cambios
            });
        }
    }

    // Cargar las tareas al cargar la página
    fetchAndRenderTasks();
});