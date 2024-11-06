import firebase_admin
import pandas as pd
from firebase_admin import credentials, firestore
import joblib
import matplotlib.pyplot as plt
from datetime import datetime
import re

def procesar_glucosaIndividual(user_id):
    # Inicializar la aplicación de Firebase Admin
    db = firestore.client()
    try:
        modelo_diabetes = joblib.load('BackEnd/model_random_forest.pkl')
    except FileNotFoundError:
        print("Modelo no encontrado.")
        return

    # Obtén la última entrada del usuario desde Firestore
    entries_ref = db.collection('entries').where('userId', '==', user_id).order_by('createdAt', direction=firestore.Query.DESCENDING).limit(1)
    entry = entries_ref.get()

    if not entry:
        print("No se encontraron entradas para el usuario.")
        return

    entry_data = entry[0].to_dict()  # Toma el primer documento (última entrada)
    
    # Extrae la fecha de la entrada y conviértela al formato adecuado
    # Extrae la fecha de la entrada y conviértela al formato adecuado
    fecha_entrada_str = entry_data.get('Fecha', '')  # Suponemos que 'Fecha' está en formato texto

    match = None  # Definir match al principio
    if isinstance(fecha_entrada_str, str):
        # Intentar hacer un match con el formato de fecha y hora (YYYY-MM-DD HH:MM:SS)
        match = re.match(r"(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})", fecha_entrada_str)
    elif isinstance(fecha_entrada_str, datetime):
        fecha_entrada_str = fecha_entrada_str.strftime("%Y-%m-%d %H:%M:%S")  # Convertir a cadena con formato YYYY-MM-DD HH:MM:SS
        match = re.match(r"(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})", fecha_entrada_str)
    else:
        print(f"Error: tipo de fecha inesperado: {type(fecha_entrada_str)}")

    if match:
        # Extraer los componentes de la fecha y hora
        año = int(match.group(1))
        mes = int(match.group(2))
        dia = int(match.group(3))
        hora = int(match.group(4))
        minuto = int(match.group(5))
        segundo = int(match.group(6))

        # Crear la fecha final con hora
        fecha_entrada = datetime(año, mes, dia, hora, minuto, segundo)

        # Convertir la fecha al formato adecuado
        fecha_entrada_formateada = fecha_entrada.strftime('%Y-%m-%d %H:%M:%S')
    else:
        print(f"Error al procesar la fecha: {fecha_entrada_str}")
        return


    # Extrae las características necesarias
    #date,calories,heart_rate,steps,basal_rate,bolus_volume_delivered,carb_input
    features = [[
        float(entry_data.get('CaloriasQuemadas', 0)),
        float(entry_data.get('RitmoCardiaco', 0)),
        float(entry_data.get('Pasos', 0)),  # Asegúrate de tener este campo en tu entrada
        float(entry_data.get('TasaBasal', 0)),  # Agrega este campo según tu lógica
        float(entry_data.get('VolumenBoloAdministrado', 0)),
        float(entry_data.get('CarbIngeridos', 0))
    ]]
    
    # Predicción de glucosa
    glucosa_pred = modelo_diabetes.predict(features)

    # Crear un DataFrame para la nueva entrada
    new_row = pd.DataFrame({'date': [fecha_entrada_formateada], 'Glucosa': glucosa_pred})

    # Ruta del archivo CSV donde se van a agregar los datos
    output_csv_path = f'BackEnd/SalidasGlucosa/{user_id}_glucosa_output.csv'

    try:
        # Intenta leer el archivo CSV existente
        df_existing = pd.read_csv(output_csv_path)
    except FileNotFoundError:
        # Si el archivo no existe, crea un nuevo DataFrame con las columnas adecuadas
        df_existing = pd.DataFrame(columns=['date', 'Glucosa'])

    # Añade la nueva fila al DataFrame existente
    df_existing = pd.concat([df_existing, new_row], ignore_index=True)

    # Guarda el DataFrame actualizado en el archivo CSV
    df_existing.to_csv(output_csv_path, index=False)

    # Graficar
    plt.figure(figsize=(12, 6))
    plt.plot(df_existing['date'], df_existing['Glucosa'], marker='o', color='b', label='Glucosa')
    plt.xticks(rotation=90)
    plt.xlabel("Fecha")
    plt.ylabel("Nivel de Glucosa")
    plt.title("Nivel de Glucosa vs Fecha")
    plt.legend()
    plt.tight_layout()
    plt.savefig(f'BackEnd/SalidasImagenes/{user_id}_salida.jpg')

