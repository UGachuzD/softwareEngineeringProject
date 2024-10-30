from flask import Flask, jsonify, request, send_file

import os
import threading
from entrenar import procesar_glucosa

app = Flask(__name__)

# Define la carpeta de destino para guardar los archivos
UPLOAD_FOLDER = 'BackEnd/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Crea la carpeta si no existe

def train_model_in_background(file_path):
    # Entrena el modelo en un hilo separado
    try:
        procesar_glucosa(file_path)
        print("Modelo entrenado y procesado con éxito usando 'latest.csv'.")
    except Exception as e:
        print(f"Error al procesar el archivo: {str(e)}")

@app.route('/api/train-model', methods=['GET'])
def train_model():
    # Ruta del archivo CSV más reciente
    file_path = os.path.join(UPLOAD_FOLDER, 'latest.csv')
    
    # Verificar si el archivo existe
    if not os.path.exists(file_path):
        return jsonify(message="El archivo 'latest.csv' no se encontró en la carpeta 'uploads'."), 400
    
    # Ejecutar el entrenamiento en un hilo separado
    threading.Thread(target=train_model_in_background, args=(file_path,)).start()
    
    return jsonify(message="Entrenamiento del modelo iniciado."), 202  # Respuesta rápida

@app.route('/api/upload-csv', methods=['POST'])
def upload_csv():
    if 'file' not in request.files:
        return jsonify(message='No file part'), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify(message='No selected file'), 400

    # Guarda el archivo siempre como 'latest.csv' en la carpeta de destino
    file_path = os.path.join(UPLOAD_FOLDER, 'latest.csv')
    file.save(file_path)

    return jsonify(message='Archivo CSV recibido y guardado como latest.csv con éxito.')

@app.route('/api/get-image', methods=['GET'])
def get_image():
    try:
        file_path = 'BackEnd/salida.jpg'
        if os.path.exists(file_path):
            print("Imagen encontrada, enviando archivo.")
            return send_file(file_path, mimetype='image/jpeg')
        else:
            print("Imagen no encontrada en la ruta especificada.")
            return jsonify(message="Imagen no encontrada."), 404
    except Exception as e:
        print(f"Error al enviar la imagen: {str(e)}")
        return jsonify(message="Error interno al enviar la imagen."), 500 ##no sirve




@app.route('/api/get-csv-content', methods=['GET'])
def get_csv_content():
    file_path = 'BackEnd/glucosa_output.csv'
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            csv_content = file.read()
        return jsonify(content=csv_content)
    else:
        return jsonify(message="Archivo CSV no encontrado."), 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
