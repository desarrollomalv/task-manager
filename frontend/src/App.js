import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    tarea: '',
    responsable: '',
    accion_recomendada: '',
    estado_actual: '',
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
        <input type="text" name="tarea" placeholder="Tarea" value={newTask.tarea} onChange={handleChange} />
        <input type="text" name="responsable" placeholder="Responsable" value={newTask.responsable} onChange={handleChange} />
        <input type="text" name="accion_recomendada" placeholder="Acción Recomendada" value={newTask.accion_recomendada} onChange={handleChange} />
        <input type="text" name="estado_actual" placeholder="Estado Actual" value={newTask.estado_actual} onChange={handleChange} />
        <input type="file" name="archivo" placeholder="Archivo" onChange={handleChange} />
        <button type="submit">Agregar Tarea</button>
      </form>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.tarea} - {task.responsable} - {task.accion_recomendada} - {task.estado_actual}
            <button onClick={() => handleDelete(task.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
