from flask import request, jsonify
from app import app, db
from models import Task
import os

@app.route('/tasks', methods=['GET', 'POST'])
def manage_tasks():
    if request.method == 'POST':
        data = request.form  # Cambiar a request.form para multipart/form-data
        new_task = Task(
            tarea=data.get('tarea'),
            responsable=data.get('responsable'),
            accion_recomendada=data.get('accion_recomendada'),
            estado_actual=data.get('estado_actual'),
            prioridad=data.get('prioridad'),
            observaciones=data.get('observaciones')
        )

        # Manejar el archivo subido si existe
        if 'archivo' in request.files:
            file = request.files['archivo']
            if file.filename != '':
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
                file.save(file_path)
                new_task.archivo = file.filename

        db.session.add(new_task)
        db.session.commit()
        return jsonify({"message": "Task created"}), 201

    tasks = Task.query.all()
    return jsonify([{
        'id': task.id,
        'tarea': task.tarea,
        'responsable': task.responsable,
        'accion_recomendada': task.accion_recomendada,
        'estado_actual': task.estado_actual,
        'prioridad': task.prioridad,
        'observaciones': task.observaciones,
        'archivo': task.archivo
    } for task in tasks])

@app.route('/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    task = Task.query.get(id)
    if task:
        # Si la tarea tiene un archivo asociado, eliminarlo también
        if task.archivo:
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], task.archivo)
            if os.path.exists(file_path):
                os.remove(file_path)
                
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
    task.tarea = data.get('tarea')
    task.responsable = data.get('responsable')
    task.accion_recomendada = data.get('accion_recomendada')
    task.estado_actual = data.get('estado_actual')
    task.prioridad = data.get('prioridad')
    task.observaciones = data.get('observaciones')

    # Manejar el archivo subido si existe
    if 'archivo' in request.files:
        file = request.files['archivo']
        if file.filename != '':
            # Elimina el archivo anterior si existe
            if task.archivo:
                old_file_path = os.path.join(app.config['UPLOAD_FOLDER'], task.archivo)
                if os.path.exists(old_file_path):
                    os.remove(old_file_path)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(file_path)
            task.archivo = file.filename

    db.session.commit()
    return jsonify({"message": "Task updated"}), 200
