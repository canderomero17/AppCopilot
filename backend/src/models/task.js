const { v4: uuidv4 } = require('uuid');

class Task {
  constructor({
    title,
    description = '',
    dueDate = '',
    priority = 'Medio',
    status = 'Pendiente'
  }) {
    this.id = uuidv4();
    this.title = title;
    this.description = description;
    this.dueDate = dueDate; // string, formato fecha
    this.priority = priority; // 'Bajo', 'Medio', 'Alto'
    this.status = status; // 'Pendiente', 'Completado'
  }
}

module.exports = Task;