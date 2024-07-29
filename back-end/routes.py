from flask import request, jsonify
from app import app, db
from models import Task

@app.route('/tasks', methods=['GET', 'POST'])
def manage_tasks():
    if request.method == 'POST':
        data = request.form
        new_task = Task(
            tarea=data.get('tarea'),
            responsable=data.get('responsable'),
            accion_recomendada=data.get('accion_recomendada'),
            estado_actual=data.get('estado_actual'),
            archivo=data.get('archivo', '')
        )
        db.session.add(new_task)
        db.session.commit()
        return jsonify({"id": new_task.id, "message": "Task created"}), 201

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
