from flask import Flask, jsonify, request, send_file
import os
import threading
from entrenar import procesar_glucosa
from entrenarIndividual import procesar_glucosaIndividual
import firebase_admin
from firebase_admin import credentials, firestore

# Inicializar Firebase fuera de cualquier función
if not firebase_admin._apps:
    cred = credentials.Certificate('BackEnd/appdiabetes-75037-firebase-adminsdk-cm6u3-4b8d33055b.json')  # Reemplaza con la ruta a tu archivo JSON
    firebase_admin.initialize_app(cred)

db = firestore.client()

app = Flask(__name__)



BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Ruta del archivo actual
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
IMAGE_DIR = "../BackEnd/SalidasImagenes/"
CSV_DIR = os.path.join(BASE_DIR, 'SalidasGlucosa')


def train_model_in_background(file_path):
    try:
        procesar_glucosa(file_path)
        print(f"Modelo entrenado usando '{file_path}'.")
    except Exception as e:
        print(f"Error al procesar el archivo: {str(e)}")


def train_model_individual(userID):
    try:
        procesar_glucosaIndividual(userID)
        print(f"Modelo actualizado para el usuario: '{userID}'.")
    except Exception as e:
        print(f"Error al procesar la petición: {str(e)}")



@app.route('/api/train-model/<user_id>', methods=['GET'])
def train_model(user_id):
    file_path = os.path.join(UPLOAD_FOLDER, f'{user_id}_latest.csv')
    
    if not os.path.exists(file_path):
        return jsonify(message=f"El archivo '{user_id}_latest.csv' no se encontró."), 400
    
    threading.Thread(target=train_model_in_background, args=(file_path,)).start()
    return jsonify(message="Entrenamiento del modelo iniciado."), 202
    
@app.route('/api/ModeloEntradaIndividual/<user_id>', methods=['GET'])
def train_modelInd(user_id):    
    threading.Thread(target=train_model_individual, args=(user_id,)).start()
    return jsonify(message="Entrenamiento del modelo actualizado iniciado."), 202



@app.route('/api/upload-csv/<user_id>', methods=['POST'])
def upload_csv(user_id):
    if 'file' not in request.files:
        return jsonify(message='No file part'), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify(message='No selected file'), 400

    file_path = os.path.join(UPLOAD_FOLDER, f'{user_id}_latest.csv')
    file.save(file_path)
    return jsonify(message=f'Archivo CSV guardado como {user_id}_latest.csv.')

@app.route('/api/get-csv-content/<user_id>', methods=['GET'])
def get_csv_content(user_id):
    #file_path = f'BackEnd/SalidasGlucosa/{user_id}_glucosa_output.csv'
    file_path = os.path.join(CSV_DIR, f"{user_id}_glucosa_output.csv")
    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            csv_content = file.read()
        return jsonify(content=csv_content)
    else:
        return jsonify(message=f"Archivo CSV para {user_id} no encontrado."), 404

@app.route('/api/get-image/<user_id>', methods=['GET'])
def get_image(user_id):
    #file_path = f'BackEnd/SalidasImagenes/{user_id}_salida.jpg'
    #fallback_path = 'BackEnd/SalidasImagenes/Nodata.jpg'
    file_path = os.path.join(IMAGE_DIR, f"{user_id}_salida.jpg")
    fallback_path = os.path.join(IMAGE_DIR, 'Nodata.jpg')
    if os.path.exists(file_path):
        return send_file(file_path, mimetype='image/jpeg')
    elif os.path.exists(fallback_path):
        return send_file(fallback_path, mimetype='image/jpeg')
    else:
        return jsonify(message="Imagen no encontrada."), 404
    




if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

