import os
import sys

print(f"Current working directory: {os.getcwd()}")
print(f"Python path: {sys.path}")

from app import app

if __name__ == "__main__":
    app.run()