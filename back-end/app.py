from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'  # Carpeta para archivos subidos
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Tamaño máximo de archivo en 16 MB

db = SQLAlchemy(app)
CORS(app)

import routes

with app.app_context():
    db.create_all()

@app.route('/')
def hello():
    return "Si estas viendo esto, app.py se está ejecutando CON LA CONFIGURACION NUEVA!"