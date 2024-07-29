# routes.py

import os
from flask import jsonify, request
from app import app, db
from models import Task

@app.route('/tasks', methods=['GET', 'POST'])
def manage_tasks():
    if request.method == 'POST':
        tarea = request.form.get('tarea')
        responsable = request.form.get('responsable')
        accion_recomendada = request.form.get('accion_recomendada')
        estado_actual = request.form.get('estado_actual')
        archivo = request.files.get('archivo')

        new_task = Task(
            tarea=tarea,
            responsable=responsable,
            accion_recomendada=accion_recomendada,
            estado_actual=estado_actual,
            archivo=archivo.filename if archivo else ''
        )
        db.session.add(new_task)
        db.session.commit()

        if archivo:
            archivo.save(os.path.join(app.config['UPLOAD_FOLDER'], archivo.filename))

        return jsonify({"message": "Task created"}), 201

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
        db.session.delete(task)
        db.session.commit()
        return jsonify({"message": "Task deleted"}), 200
    return jsonify({"message": "Task not found"}), 404