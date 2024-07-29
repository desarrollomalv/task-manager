from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Crear una instancia de la aplicación Flask
app = Flask(__name__)

# Configurar la base de datos
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Desactivar la notificación de modificaciones de la base de datos

# Inicializar SQLAlchemy
db = SQLAlchemy(app)

# Habilitar CORS
CORS(app)

# Importar las rutas después de inicializar la aplicación
import routes

# Crear todas las tablas
with app.app_context():
    db.create_all()

@app.route('/')
def hello():
    return "Si estas viendo esto, app.py se está ejecutando CON LA CONFIGURACION NUEVA!"