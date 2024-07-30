from flask import request, jsonify, send_file
from app import app, db
from models import Task
import os

UPLOAD_FOLDER = 'uploads'  # Define tu carpeta de subidas

@app.route('/tasks', methods=['GET', 'POST'])
def manage_tasks():
    if request.method == 'POST':
        data = request.form
        archivo = request.files.get('archivo')
        archivo_nombre = ''
        if archivo:
            archivo_nombre = archivo.filename
            archivo.save(os.path.join(UPLOAD_FOLDER, archivo_nombre))

        new_task = Task(
            tarea=data['tarea'],
            responsable=data['responsable'],
            accion_recomendada=data['accion_recomendada'],
            estado_actual=data['estado_actual'],
            prioridad=data['prioridad'],  # Agregado
            archivo=archivo_nombre
        )
        db.session.add(new_task)
        db.session.commit()
        return jsonify({"message": "Task created", "id": new_task.id}), 201

    tasks = Task.query.all()
    return jsonify([{
        'id': task.id,
        'tarea': task.tarea,
        'responsable': task.responsable,
        'accion_recomendada': task.accion_recomendada,
        'estado_actual': task.estado_actual,
        'prioridad': task.prioridad,  # Agregado
        'archivo': task.archivo
    } for task in tasks])

@app.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get(id)
    if task:
        if task.archivo:
            archivo_path = os.path.join(UPLOAD_FOLDER, task.archivo)
            if os.path.exists(archivo_path):
                os.remove(archivo_path)
        db.session.delete(task)
        db.session.commit()
        return jsonify({"message": "Task deleted"}), 200
    return jsonify({"message": "Task not found"}), 404

@app.route('/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    task = Task.query.get(id)
    if not task:
        return jsonify({"message": "Task not found"}), 404
    
    data = request.form
    archivo = request.files.get('archivo')
    
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
    if archivo:
        # Eliminar archivo existente si lo hay
        if task.archivo:
            archivo_path = os.path.join(UPLOAD_FOLDER, task.archivo)
            if os.path.exists(archivo_path):
                os.remove(archivo_path)
        # Guardar el nuevo archivo
        archivo_nombre = archivo.filename
        archivo.save(os.path.join(UPLOAD_FOLDER, archivo_nombre))
        task.archivo = archivo_nombre

    db.session.commit()
    return jsonify({"message": "Task updated"}), 200

@app.route('/uploads/<filename>', methods=['GET'])
def download_file(filename):
    return send_file(os.path.join(UPLOAD_FOLDER, filename), as_attachment=True)
