from flask import request, jsonify, send_from_directory, send_file
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

@app.route('/uploads/<filename>', methods=['GET'])
def download_file(filename):
    return send_file(os.path.join(UPLOAD_FOLDER, filename), as_attachment=True)
