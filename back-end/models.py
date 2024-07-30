# models.py

from app import db

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tarea = db.Column(db.String(200), nullable=False)
    responsable = db.Column(db.String(100), nullable=False)
    accion_recomendada = db.Column(db.String(200), nullable=False)
    estado_actual = db.Column(db.String(100), nullable=False)
    prioridad = db.Column(db.String(20), nullable=False)  # Nuevo campo
    archivo = db.Column(db.String(200), nullable=True)
