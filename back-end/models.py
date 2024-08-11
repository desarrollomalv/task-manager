from app import db

class Task(db.Model):
    __tablename__ = 'task'
    __table_args__ = {'schema': 'public'}  # Asegura que el esquema sea 'public'

    id = db.Column(db.Integer, primary_key=True)
    tarea = db.Column(db.String(100), nullable=False)
    responsable = db.Column(db.String(100), nullable=False)
    accion_recomendada = db.Column(db.String(100), nullable=False)
    estado_actual = db.Column(db.String(50), nullable=False)
    prioridad = db.Column(db.String(20), nullable=True)
    archivo = db.Column(db.String(100), nullable=True)
    observaciones = db.Column(db.Text, nullable=True)
