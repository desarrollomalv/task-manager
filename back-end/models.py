# models.py

from app import db

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tarea = db.Column(db.String(255), nullable=False)
    responsable = db.Column(db.String(255), nullable=False)
    accion_recomendada = db.Column(db.String(255), nullable=False)
    estado_actual = db.Column(db.String(50), nullable=False, default='Pendiente')
    prioridad = db.Column(db.String(50), nullable=True)
    archivo = db.Column(db.String(255), nullable=True)
