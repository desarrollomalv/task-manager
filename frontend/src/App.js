import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    tarea: '',
    responsable: '',
    accion_recomendada: '',
    estado_actual: 'Pendiente', // Estado por defecto
    prioridad: '',
    archivo: null,
    observaciones: ''
  });
  const [taskToEdit, setTaskToEdit] = useState(null);

  const backendUrl = 'https://task-manager-2avl.onrender.com';

  useEffect(() => {
    axios.get(`${backendUrl}/tasks`)
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => console.error('Error fetching tasks:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setNewTask({
      ...newTask,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('tarea', newTask.tarea);
    formData.append('responsable', newTask.responsable);
    formData.append('accion_recomendada', newTask.accion_recomendada);
    formData.append('estado_actual', newTask.estado_actual);
    formData.append('prioridad', newTask.prioridad);
    formData.append('observaciones', newTask.observaciones);
    if (newTask.archivo) {
      formData.append('archivo', newTask.archivo);
    }

    axios.post(`${backendUrl}/tasks`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        axios.get(`${backendUrl}/tasks`)
          .then(response => {
            setTasks(response.data);
          })
          .catch(error => console.error('Error fetching tasks:', error));

        setNewTask({
          tarea: '',
          responsable: '',
          accion_recomendada: '',
          estado_actual: '',
          prioridad: '',
          archivo: null,
          observaciones: ''
        });
      })
      .catch(error => console.error('Error adding task:', error));
  };

  const handleUpdate = (id) => {
    const formData = new FormData();
    formData.append('estado_actual', newTask.estado_actual);
    formData.append('prioridad', newTask.prioridad);
    formData.append('observaciones', newTask.observaciones);
    if (newTask.archivo) {
      formData.append('archivo', newTask.archivo);
    }

    axios.put(`${backendUrl}/tasks/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        axios.get(`${backendUrl}/tasks`)
          .then(response => {
            setTasks(response.data);
          })
          .catch(error => console.error('Error fetching tasks:', error));

        setTaskToEdit(null);
        setNewTask({
          tarea: '',
          responsable: '',
          accion_recomendada: '',
          estado_actual: '',
          prioridad: '',
          archivo: null,
          observaciones: ''
        });
      })
      .catch(error => console.error('Error updating task:', error));
  };

  const handleDelete = (id) => {
    axios.delete(`${backendUrl}/tasks/${id}`)
      .then(response => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(error => console.error('Error deleting task:', error));
  };

  const handleEditClick = (task) => {
    setTaskToEdit(task);
    setNewTask({
      tarea: task.tarea,
      responsable: task.responsable,
      accion_recomendada: task.accion_recomendada,
      estado_actual: task.estado_actual,
      prioridad: task.prioridad,
      archivo: null,
      observaciones: task.observaciones
    });
  };

  return (
    <>
      <div className="App">
        <h1>Control de Tareas</h1>
        <form onSubmit={taskToEdit ? (e) => { e.preventDefault(); handleUpdate(taskToEdit.id); } : handleSubmit}>
          <input
            type="text"
            name="tarea"
            placeholder="Tarea"
            value={newTask.tarea}
            onChange={handleChange}
          />
          <input
            type="text"
            name="accion_recomendada"
            placeholder="Acción Recomendada"
            value={newTask.accion_recomendada}
            onChange={handleChange}
          />
          <input
            type="text"
            name="responsable"
            placeholder="Responsable"
            value={newTask.responsable}
            onChange={handleChange}
          />
          <select
            name="estado_actual"
            value={newTask.estado_actual}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona Estado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Completado">Completado</option>
            <option value="Descartado">Descartado</option>
          </select>
          <select
            name="prioridad"
            value={newTask.prioridad}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona Prioridad</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
          <input
            name="observaciones"
            placeholder="Observaciones"
            value={newTask.observaciones}
            onChange={handleChange}
          />
          <label htmlFor="archivo">Seleccionar archivo</label>
          <input
            type="file"
            id="archivo"
            name="archivo"
            onChange={handleChange}
          />
          <button type="submit">{taskToEdit ? 'Actualizar' : 'Agregar'} Tarea</button>
        </form>
        <div className="task-grid">
          {tasks.map(task => (
            <div key={task.id} className="task-card">
              <h3>{task.tarea}</h3>
              <p>Acción Recomendada: {task.accion_recomendada}</p>
              <p>Responsable: {task.responsable}</p>
              <p>Estado: {task.estado_actual}</p>
              <p>Prioridad: {task.prioridad}</p>
              <p>Observaciones: {task.observaciones}</p>
              {task.archivo && <a href={task.archivo} download>{task.archivo.split('/').pop()} {/* Muestra el nombre del archivo */}</a>}
              <div className="task-actions">
                <button onClick={() => handleEditClick(task)}>Editar</button>
                <button onClick={() => handleDelete(task.id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <footer className="footer">
        <p>&copy; 2024 A.v.N; M.E.V. Todos los derechos reservados.</p>
      </footer>
    </>
  );
}

export default App;
