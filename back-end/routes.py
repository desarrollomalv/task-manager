from flask import request, jsonify, send_from_directory
from app import app, db
from models import Task
import os

@app.route('/tasks', methods=['GET', 'POST'])
def manage_tasks():
    if request.method == 'POST':
        data = request.form
        archivo = request.files.get('archivo')
        archivo_nombre = archivo.filename if archivo else ''

        new_task = Task(
            tarea=data['tarea'],
            responsable=data['responsable'],
            accion_recomendada=data['accion_recomendada'],
            estado_actual=data['estado_actual'],
            prioridad=data['prioridad'],
            archivo=archivo_nombre,
            observacion=data.get('observacion', '')
        )
        db.session.add(new_task)
        db.session.commit()

        if archivo:
            archivo.save(os.path.join('uploads', archivo_nombre))

        return jsonify({"id": new_task.id, "message": "Task created"}), 201

    tasks = Task.query.all()
    return jsonify([{
        'id': task.id,
        'tarea': task.tarea,
        'responsable': task.responsable,
        'accion_recomendada': task.accion_recomendada,
        'estado_actual': task.estado_actual,
        'prioridad': task.prioridad,
        'archivo': task.archivo,
        'observacion': task.observacion
    } for task in tasks])

@app.route('/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    task = Task.query.get(id)
    if not task:
        return jsonify({"message": "Task not found"}), 404

    data = request.form
    archivo = request.files.get('archivo')
    archivo_nombre = archivo.filename if archivo else task.archivo

    task.tarea = data['tarea']
    task.responsable = data['responsable']
    task.accion_recomendada = data['accion_recomendada']
    task.estado_actual = data['estado_actual']
    task.prioridad = data['prioridad']
    task.observacion = data.get('observacion', task.observacion)
    task.archivo = archivo_nombre

    db.session.commit()

    if archivo:
        archivo.save(os.path.join('uploads', archivo_nombre))

    return jsonify({"message": "Task updated"}), 200

@app.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get(id)
    if not task:
        return jsonify({"message": "Task not found"}), 404

    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted"}), 200

@app.route('/uploads/<filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory('uploads', filename)
