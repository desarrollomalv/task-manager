from flask import request, jsonify, send_file
from app import app, db
from models import Archivo, Task
import os

UPLOAD_FOLDER = 'uploads'  # Define tu carpeta de subidas

@app.route('/tasks', methods=['POST'])
def manage_tasks():
    data = request.form
    archivos = request.files.getlist('archivo')  # Cambia para manejar múltiples archivos
    archivo_nombres = []

    for archivo in archivos:
        if archivo:
            archivo_nombre = archivo.filename
            archivo.save(os.path.join(UPLOAD_FOLDER, archivo_nombre))
            archivo_nombres.append(archivo_nombre)

    new_task = Task(
        tarea=data['tarea'],
        responsable=data['responsable'],
        accion_recomendada=data['accion_recomendada'],
        estado_actual=data['estado_actual'],
        prioridad=data.get('prioridad'),
        observaciones=data.get('observaciones')
    )
    db.session.add(new_task)
    db.session.commit()

    for nombre in archivo_nombres:
        nuevo_archivo = Archivo(nombre=nombre, tarea_id=new_task.id)
        db.session.add(nuevo_archivo)

    db.session.commit()
    return jsonify({"message": "Task created", "id": new_task.id}), 201

@app.route('/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    task = Task.query.get(id)
    if not task:
        return jsonify({"message": "Task not found"}), 404
    
    data = request.form
    archivos = request.files.getlist('archivo')
    
    if 'tarea' in data:
        task.tarea = data['tarea']
    if 'responsable' in data:
        task.responsable = data['responsable']
    if 'accion_recomendada' in data:
        task.accion_recomendada = data['accion_recomendada']
    if 'estado_actual' in data:
        task.estado_actual = data['estado_actual']
    if 'prioridad' in data:
        task.prioridad = data['prioridad']
    if 'observaciones' in data:
        task.observaciones = data['observaciones']

    # Eliminar archivos existentes si los hay
    for archivo in task.archivos:
        archivo_path = os.path.join(UPLOAD_FOLDER, archivo.nombre)
        if os.path.exists(archivo_path):
            os.remove(archivo_path)
        db.session.delete(archivo)

    # Guardar los nuevos archivos
    for archivo in archivos:
        if archivo:
            archivo_nombre = archivo.filename
            archivo.save(os.path.join(UPLOAD_FOLDER, archivo_nombre))
            nuevo_archivo = Archivo(nombre=archivo_nombre, tarea_id=task.id)
            db.session.add(nuevo_archivo)

    db.session.commit()
    return jsonify({"message": "Task updated"}), 200


@app.route('/uploads/<filename>', methods=['GET'])
def download_file(filename):
    return send_file(os.path.join(UPLOAD_FOLDER, filename), as_attachment=True)
