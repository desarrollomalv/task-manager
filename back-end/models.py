# models.py

from app import db
from sqlalchemy.dialects.postgresql import ARRAY  # Importa ARRAY si estás usando PostgreSQL

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tarea = db.Column(db.String(100), nullable=False)
    responsable = db.Column(db.String(100), nullable=False)
    accion_recomendada = db.Column(db.String(100), nullable=False)
    estado_actual = db.Column(db.String(50), nullable=False)
    prioridad = db.Column(db.String(20), nullable=True)
    archivo = db.Column(db.String(100), nullable=True)
    observaciones = db.Column(db.Text, nullable=True)  # Nuevo campo
