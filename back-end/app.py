import os
from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_migrate import Migrate  # Importa Migrate

# Crear una instancia de la aplicación Flask
app = Flask(__name__)

# Configurar la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://tareas:lRqaw5Bb6aXW0zB3dLOACiY24ulp6NSW@dpg-cqlc4f3qf0us73996msg-a.oregon-postgres.render.com/tareas_6ic6'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'  # Carpeta para archivos subidos
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Limitar el tamaño del archivo a 16MB

# Inicializar SQLAlchemy
db = SQLAlchemy(app)

# Inicializar Migrate
migrate = Migrate(app, db)

# Habilitar CORS
CORS(app)

# Crear carpeta para subir archivos si no existe
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

import routes

# Crear todas las tablas
with app.app_context():
    db.create_all()

@app.route('/')
def hello():
    return "Si estas viendo esto, app.py se esta ejecutando CON LA CONFIGURACION NUEVA PARA LOS ARCHIVOS!"

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
