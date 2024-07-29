// src/TaskManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ tarea: '', responsable: '', accion: '', estado: '', archivo: null });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get('https://task-manager-2avl.onrender.com/tareas');
    setTasks(response.data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewTask({ ...newTask, archivo: e.target.files[0] });
  };

  const handleAddTask = async () => {
    const formData = new FormData();
    formData.append('tarea', newTask.tarea);
    formData.append('responsable', newTask.responsable);
    formData.append('accion', newTask.accion);
    formData.append('estado', newTask.estado);
    formData.append('archivo', newTask.archivo);

    await axios.post('https://task-manager-2avl.onrender.com', formData);
    fetchTasks();
  };

  const handleDeleteTask = async (id) => {
    await axios.delete(`https://task-manager-2avl.onrender.com/tareas/${id}`);
    fetchTasks();
  };

  return (
    <div>
      <h1>Gestión de Tareas</h1>
      <div>
        <input type="text" name="tarea" placeholder="Tarea" onChange={handleInputChange} />
        <input type="text" name="responsable" placeholder="Responsable" onChange={handleInputChange} />
        <input type="text" name="accion" placeholder="Acción Recomendada" onChange={handleInputChange} />
        <input type="text" name="estado" placeholder="Estado Actual" onChange={handleInputChange} />
        <input type="file" name="archivo" onChange={handleFileChange} />
        <button onClick={handleAddTask}>Agregar Tarea</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.tarea} - {task.responsable} - {task.accion} - {task.estado}
            <button onClick={() => handleDeleteTask(task.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
