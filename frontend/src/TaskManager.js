import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import logo from './UNCPBA.png';

function TaskManager() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({
      tarea: '',
      responsable: '',
      accion_recomendada: '',
      estado_actual: 'Pendiente', // Estado por defecto
      prioridad: '',
      archivos: [], // Cambiado a un array para múltiples archivos
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
        if (name === 'archivos') {
            setNewTask({
                ...newTask,
                archivos: Array.from(files)
            });
        } else {
            setNewTask({
                ...newTask,
                [name]: value
            });
        }
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

        // Añadir múltiples archivos al FormData
        newTask.archivos.forEach((archivo, index) => {
            formData.append(`archivos[${index}]`, archivo);
        });

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
                estado_actual: 'Pendiente',
                prioridad: '',
                archivos: [],
                observaciones: ''
            });
        })
        .catch(error => console.error('Error adding task:', error));
    };

    const handleUpdate = (id) => {
        const formData = new FormData();
        formData.append('tarea', newTask.tarea);
        formData.append('responsable', newTask.responsable);
        formData.append('accion_recomendada', newTask.accion_recomendada);
        formData.append('estado_actual', newTask.estado_actual);
        formData.append('prioridad', newTask.prioridad);
        formData.append('observaciones', newTask.observaciones);

        newTask.archivos.forEach((archivo, index) => {
            formData.append(`archivos[${index}]`, archivo);
        });

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
                estado_actual: 'Pendiente',
                prioridad: '',
                archivos: [],
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
            archivos: [], // Inicializar con un array vacío
            observaciones: task.observaciones
        });
    };

    const handleDeleteArchivo = (taskId, archivo) => {
        axios.delete(`${backendUrl}/tasks/${taskId}/files/${archivo}`)
            .then(response => {
                // Actualiza la lista de tareas después de eliminar el archivo
                axios.get(`${backendUrl}/tasks`)
                    .then(response => {
                        setTasks(response.data);
                    })
                    .catch(error => console.error('Error fetching tasks:', error));
            })
            .catch(error => console.error('Error deleting file:', error));
    };

    return (
        <>
            <div className="App">
                <h1>Control de Tareas</h1>
                <img src={logo} alt="Logo" className="logo" />
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
                    <label htmlFor="archivos">Seleccionar archivos</label>
                    <input
                        type="file"
                        id="archivos"
                        name="archivos"
                        onChange={handleChange}
                        multiple
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

                            {task.archivos && task.archivos.length > 0 && (
                                <div>
                                    {task.archivos.map((archivo, index) => (
                                        <div key={index}>
                                            <a href={`${backendUrl}/uploads/${archivo}`} download>
                                                Descargar {archivo}
                                            </a>
                                            <button onClick={() => handleDeleteArchivo(task.id, archivo)}>Eliminar</button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="task-actions">
                                <button onClick={() => handleEditClick(task)}>Editar</button>
                                <button onClick={() => handleDelete(task.id)}>Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <footer className="footer">
                <p>2024 Todos los derechos reservados - Tu Empresa</p>
            </footer>
        </>
    );
}

export default TaskManager;
