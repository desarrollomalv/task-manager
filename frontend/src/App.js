import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    tarea: '',
    responsable: '',
    accion_recomendada: '',
    estado_actual: 'Pendiente',
    prioridad: 'Media',
    archivo: null,
    observacion: ''
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
          estado_actual: 'Pendiente',
          prioridad: 'Media',
          archivo: null,
          observacion: ''
        });
        window.location.reload();
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

  const handleUpdate = (id, updatedTask) => {
    const formData = new FormData();
    formData.append('tarea', updatedTask.tarea);
    formData.append('responsable', updatedTask.responsable);
    formData.append('accion_recomendada', updatedTask.accion_recomendada);
    formData.append('estado_actual', updatedTask.estado_actual);
    formData.append('prioridad', updatedTask.prioridad);
    formData.append('observacion', updatedTask.observacion);
    if (updatedTask.archivo) {
      formData.append('archivo', updatedTask.archivo);
    }

    axios.put(`${backendUrl}/tasks/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        setTasks(tasks.map(task => task.id === id ? { ...task, ...updatedTask } : task));
      })
      .catch(error => console.error('Error updating task:', error));
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="tarea" placeholder="Tarea" value={newTask.tarea} onChange={handleChange} />
        <input type="text" name="responsable" placeholder="Responsable" value={newTask.responsable} onChange={handleChange} />
        <input type="text" name="accion_recomendada" placeholder="Acción Recomendada" value={newTask.accion_recomendada} onChange={handleChange} />
        <select name="estado_actual" value={newTask.estado_actual} onChange={handleChange}>
          <option value="Pendiente">Pendiente</option>
          <option value="Completado">Completado</option>
          <option value="Descartado">Descartado</option>
        </select>
        <select name="prioridad" value={newTask.prioridad} onChange={handleChange}>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>
        <input type="file" name="archivo" onChange={handleChange} />
        <button type="submit">Agregar Tarea</button>
      </form>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <div>
              <strong>Tarea:</strong> {task.tarea}<br />
              <strong>Responsable:</strong> {task.responsable}<br />
              <strong>Acción Recomendada:</strong> {task.accion_recomendada}<br />
              <strong>Estado:</strong> {task.estado_actual}<br />
              <strong>Prioridad:</strong> {task.prioridad}<br />
              {task.archivo && (
                <a href={`${backendUrl}/uploads/${task.archivo}`} download>
                  Descargar archivo
                </a>
              )}
              <br />
              <button onClick={() => handleDelete(task.id)}>Eliminar</button>
            </div>
            <div>
              <h3>Actualizar Tarea</h3>
              <input type="text" name="tarea" placeholder="Tarea" value={task.tarea} onChange={(e) => handleUpdate(task.id, { ...task, tarea: e.target.value })} />
              <input type="text" name="responsable" placeholder="Responsable" value={task.responsable} onChange={(e) => handleUpdate(task.id, { ...task, responsable: e.target.value })} />
              <input type="text" name="accion_recomendada" placeholder="Acción Recomendada" value={task.accion_recomendada} onChange={(e) => handleUpdate(task.id, { ...task, accion_recomendada: e.target.value })} />
              <select name="estado_actual" value={task.estado_actual} onChange={(e) => handleUpdate(task.id, { ...task, estado_actual: e.target.value })}>
                <option value="Pendiente">Pendiente</option>
                <option value="Completado">Completado</option>
                <option value="Descartado">Descartado</option>
              </select>
              <select name="prioridad" value={task.prioridad} onChange={(e) => handleUpdate(task.id, { ...task, prioridad: e.target.value })}>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
              <textarea name="observacion" placeholder="Observación" value={task.observacion} onChange={(e) => handleUpdate(task.id, { ...task, observacion: e.target.value })}></textarea>
              <input type="file" name="archivo" onChange={(e) => handleUpdate(task.id, { ...task, archivo: e.target.files[0] })} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
