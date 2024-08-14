from app import db

class Archivo(db.Model):
    __tablename__ = 'archivo'
    __table_args__ = {'schema': 'public'}

    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    tarea_id = db.Column(db.Integer, db.ForeignKey('public.task.id'))

    tarea = db.relationship('Task', back_populates='archivos')

class Task(db.Model):
    __tablename__ = 'task'
    __table_args__ = {'schema': 'public'}

    id = db.Column(db.Integer, primary_key=True)
    tarea = db.Column(db.String(100), nullable=False)
    responsable = db.Column(db.String(100), nullable=False)
    accion_recomendada = db.Column(db.String(100), nullable=False)
    estado_actual = db.Column(db.String(50), nullable=False)
    prioridad = db.Column(db.String(20), nullable=True)
    observaciones = db.Column(db.Text, nullable=True)

    archivos = db.relationship('Archivo', back_populates='tarea', cascade='all, delete-orphan')
