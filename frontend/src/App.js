import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    tarea: '',
    responsable: '',
    accion_recomendada: '',
    estado_actual: 'Pendiente',  // Valor por defecto
    prioridad: '',  
    archivo: null
  });

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
          estado_actual: 'Pendiente',  // Reiniciar el campo
          prioridad: '',  
          archivo: null
        });
      })
      .catch(error => console.error('Error adding task:', error));
  };

  const handleDelete = (id) => {
    console.log('Deleting task with ID:', id);
    axios.delete(`${backendUrl}/tasks/${id}`)
      .then(response => {
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(error => console.error('Error deleting task:', error));
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <form onSubmit={handleSubmit}>
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
        >
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
          type="file" 
          name="archivo" 
          placeholder="Archivo" 
          onChange={handleChange} 
        />
        <button type="submit">Agregar Tarea</button>
      </form>
      <div className="task-grid">
        {tasks.map(task => (
          <div key={task.id} className="task-card">
            <h3>{task.tarea}</h3>
            <p><strong>Responsable:</strong> {task.responsable}</p>
            <p><strong>Acción Recomendada:</strong> {task.accion_recomendada}</p>
            <p><strong>Estado Actual:</strong> {task.estado_actual}</p>
            <p><strong>Prioridad:</strong> {task.prioridad}</p>  
            {task.archivo && (
              <p><a href={`${backendUrl}/uploads/${task.archivo}`} download>Descargar archivo</a></p>
            )}
            <button onClick={() => handleDelete(task.id)}>Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
