import sys
import os

# Añadir el directorio 'back-end' al PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'back-end')))

from app import app

if __name__ == "__main__":
    app.run()
