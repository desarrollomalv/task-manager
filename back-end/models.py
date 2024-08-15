from app import db
from sqlalchemy.dialects.postgresql import ARRAY  # Importa ARRAY si estás usando PostgreSQL

class Task(db.Model):
    __tablename__ = 'task'
    __table_args__ = {'schema': 'public'}

    id = db.Column(db.Integer, primary_key=True)
    tarea = db.Column(db.String(100), nullable=False)
    responsable = db.Column(db.String(100), nullable=False)
    accion_recomendada = db.Column(db.String(100), nullable=False)
    estado_actual = db.Column(db.String(50), nullable=False)
    prioridad = db.Column(db.String(20), nullable=True)
    archivos = db.Column(ARRAY(db.String), nullable=True)  # Cambia `archivo` a `archivos` que ahora es un ARRAY
    observaciones = db.Column(db.Text, nullable=True)
