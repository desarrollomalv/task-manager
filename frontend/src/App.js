import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    tarea: '',
    responsable: '',
    accion_recomendada: '',
    estado_actual: '',
    prioridad: '',  // Nuevo campo
    archivo: null,
    observaciones: ''  // Nuevo campo
  });
  const [taskToEdit, setTaskToEdit] = useState(null);  // Estado para la tarea que se edita

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
    formData.append('prioridad', newTask.prioridad);  // Nuevo campo
    formData.append('observaciones', newTask.observaciones);  // Nuevo campo
    if (newTask.archivo) {
      formData.append('archivo', newTask.archivo);
    }

    axios.post(`${backendUrl}/tasks`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        const newTaskWithId = {
          ...newTask,
          id: response.data.id
        };
        setTasks([...tasks, newTaskWithId]);
        setNewTask({
          tarea: '',
          responsable: '',
          accion_recomendada: '',
          estado_actual: '',
          prioridad: '',  // Reiniciar el campo
          archivo: null,
          observaciones: ''  // Reiniciar el campo
        });
      })
      .catch(error => console.error('Error adding task:', error));
  };

  const handleUpdate = (id) => {
    const formData = new FormData();
    formData.append('estado_actual', newTask.estado_actual); // Actualizar solo el estado actual
    formData.append('prioridad', newTask.prioridad);  // Actualizar prioridad si es necesario
    formData.append('observaciones', newTask.observaciones);  // Actualizar observaciones si es necesario
    if (newTask.archivo) {
      formData.append('archivo', newTask.archivo);
    }

    axios.put(`${backendUrl}/tasks/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        setTasks(tasks.map(task => (task.id === id ? { ...task, estado_actual: newTask.estado_actual, prioridad: newTask.prioridad, observaciones: newTask.observaciones } : task)));
        setTaskToEdit(null);
        setNewTask({
          tarea: '',
          responsable: '',
          accion_recomendada: '',
          estado_actual: '',
          prioridad: '',  // Reiniciar el campo
          archivo: null,
          observaciones: ''  // Reiniciar el campo
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
      prioridad: task.prioridad,  // Setear la prioridad
      archivo: null,
      observaciones: task.observaciones  // Setear las observaciones
    });
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>
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
          name="responsable"
          placeholder="Responsable"
          value={newTask.responsable}
          onChange={handleChange}
        />
        <input
          type="text"
          name="accion_recomendada"
          placeholder="Acción Recomendada"
          value={newTask.accion_recomendada}
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
        <textarea
          name="observaciones"
          placeholder="Observaciones"
          value={newTask.observaciones}
          onChange={handleChange}
        />
        <input
          type="file"
          name="archivo"
          placeholder="Archivo"
          onChange={handleChange}
        />
        <button type="submit">{taskToEdit ? 'Actualizar Tarea' : 'Agregar Tarea'}</button>
        {taskToEdit && <button type="button" onClick={() => setTaskToEdit(null)}>Cancelar</button>}
      </form>
      <div className="task-grid">
        {tasks.map(task => (
          <div key={task.id} className="task-card">
            <h3>{task.tarea}</h3>
            <p><strong>Responsable:</strong> {task.responsable}</p>
            <p><strong>Acción Recomendada:</strong> {task.accion_recomendada}</p>
            <p><strong>Estado Actual:</strong> {task.estado_actual}</p>
            <p><strong>Prioridad:</strong> {task.prioridad}</p>  {/* Mostrar prioridad */}
            <p><strong>Observaciones:</strong> {task.observaciones || 'Ninguna'}</p> {/* Mostrar observaciones */}
            {task.archivo && (
              <p><a href={`${backendUrl}/uploads/${task.archivo}`} download>Descargar archivo</a></p>
            )}
            <button onClick={() => handleDelete(task.id)}>Eliminar</button>
            <button onClick={() => handleEditClick(task)}>Editar</button> {/* Botón de edición */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
