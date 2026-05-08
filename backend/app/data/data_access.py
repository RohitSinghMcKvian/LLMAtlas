import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'src', 'data'))

# Simple data access layer to read the frontend data files
def get_frontend_data_path():
    return os.path.join(os.path.dirname(__file__), '..', 'frontend', 'src')

def read_frontend_data():
    # This would read the data from the frontend files
    pass