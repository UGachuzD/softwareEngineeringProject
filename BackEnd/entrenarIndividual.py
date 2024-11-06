import firebase_admin
import pandas as pd
from firebase_admin import credentials, firestore
import joblib
import matplotlib.pyplot as plt
from datetime import datetime
import re
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os

load_dotenv()

# Inicializar Firebase
cred = credentials.Certificate("BackEnd/appdiabetes-75037-firebase-adminsdk-cm6u3-4b8d33055b.json")
firebase_admin.initialize_app(cred)

def enviar_alerta_correo(email, user_id, glucosa_pred, fecha_entrada_formateada, nivel_alerta):
    sender_email = os.getenv("SENDER_EMAIL")
    sender_password = os.getenv("SENDER_PASSWORD")
    smtp_server = os.getenv("STMTP_SERVER")
    smtp_port = 587

    # Crear el mensaje
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = email
    if nivel_alerta == "hiperglucemia":
        message["Subject"] = "Alerta: Nivel alto de glucosa detectado"
        body = f"""\
        Hola,

        Se ha detectado un nivel alto de glucosa en el sistema.

        Usuario ID: {user_id}
        Glucosa Predicha: {glucosa_pred}
        Fecha de Entrada: {fecha_entrada_formateada}

        Por favor, toma las medidas necesarias.
        """
    elif nivel_alerta == "hipoglucemia":
        message["Subject"] = "Alerta: Nivel bajo de glucosa detectado (Hipoglucemia)"
        body = f"""\
        Hola,

        Se ha detectado un nivel bajo de glucosa en el sistema (posible hipoglucemia).

        Usuario ID: {user_id}
        Glucosa Predicha: {glucosa_pred}
        Fecha de Entrada: {fecha_entrada_formateada}

        Por favor, toma las medidas necesarias para estabilizar tu nivel de glucosa.
        """
    message.attach(MIMEText(body, "plain"))

    # Enviar el correo
    try:
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, email, message.as_string())
        print(f"Alerta de correo enviada a {email}")
    except Exception as e:
        print(f"Error al enviar el correo: {e}")

def procesar_glucosaIndividual(user_id):
    db = firestore.client()
    try:
        modelo_diabetes = joblib.load('BackEnd/model_random_forest.pkl')
    except FileNotFoundError:
        print("Modelo no encontrado.")
        return

    # Obtiene la entrada más reciente para el usuario
    entries_ref = db.collection('entries').where('userId', '==', user_id).order_by('createdAt', direction=firestore.Query.DESCENDING).limit(1)
    entry = entries_ref.get()

    if not entry:
        print("No se encontraron entradas para el usuario.")
        return

    entry_data = entry[0].to_dict()
    fecha_entrada_str = entry_data.get('Fecha', '')

    # Procesa la fecha
    match = None
    if isinstance(fecha_entrada_str, str):
        match = re.match(r"(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})", fecha_entrada_str)
    elif isinstance(fecha_entrada_str, datetime):
        fecha_entrada_str = fecha_entrada_str.strftime("%Y-%m-%d %H:%M:%S")
        match = re.match(r"(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})", fecha_entrada_str)
    else:
        print(f"Error: tipo de fecha inesperado: {type(fecha_entrada_str)}")
        return

    if match:
        año = int(match.group(1))
        mes = int(match.group(2))
        dia = int(match.group(3))
        hora = int(match.group(4))
        minuto = int(match.group(5))
        segundo = int(match.group(6))
        fecha_entrada = datetime(año, mes, dia, hora, minuto, segundo)
        fecha_entrada_formateada = fecha_entrada.strftime('%Y-%m-%d %H:%M:%S')
    else:
        print(f"Error al procesar la fecha: {fecha_entrada_str}")
        return

    # Preparación de características para la predicción
    features = [[
        float(entry_data.get('CaloriasQuemadas', 0)),
        float(entry_data.get('RitmoCardiaco', 0)),
        float(entry_data.get('Pasos', 0)),
        float(entry_data.get('TasaBasal', 0)),
        float(entry_data.get('VolumenBoloAdministrado', 0)),
        float(entry_data.get('CarbIngeridos', 0))
    ]]
    
    # Predicción del nivel de glucosa
    glucosa_pred = modelo_diabetes.predict(features)[0]
    new_row = pd.DataFrame({'date': [fecha_entrada_formateada], 'Glucosa': [glucosa_pred]})

    # Actualiza el archivo CSV de predicciones
    output_csv_path = f'BackEnd/SalidasGlucosa/{user_id}_glucosa_output.csv'
    try:
        df_existing = pd.read_csv(output_csv_path)
    except FileNotFoundError:
        df_existing = pd.DataFrame(columns=['date', 'Glucosa'])

    df_existing = pd.concat([df_existing, new_row], ignore_index=True)
    df_existing.to_csv(output_csv_path, index=False)

    # Genera y guarda la gráfica de glucosa
    plt.figure(figsize=(12, 6))
    plt.plot(df_existing['date'], df_existing['Glucosa'], marker='o', label='Glucosa')
    plt.xticks(rotation=90)
    plt.xlabel("Fecha")
    plt.ylabel("Nivel de Glucosa")
    plt.title("Nivel de Glucosa vs Fecha")
    plt.legend()
    plt.tight_layout()
    plt.savefig(f'BackEnd/SalidasImagenes/{user_id}_salida.jpg')

    # Actualiza Firestore con la predicción de glucosa
    user_ref = db.collection('users').document(user_id)
    user_ref.update({
        'glucosa_prediccion': glucosa_pred,
        'ultima_actualizacion_glucosa': fecha_entrada_formateada
    })

    # Obtiene el correo electrónico del usuario
    user_data = user_ref.get().to_dict()
    user_email = user_data.get('email')
    if not user_email:
        print("El usuario no tiene un correo electrónico registrado.")
        return

    # Define los límites de glucosa
    LIMITE_GLUCOSA = 140 
    LIMITE_HIPOGLUCEMIA = 100

    # Envía alerta de correo si el nivel de glucosa está fuera de los rangos normales
    if glucosa_pred > LIMITE_GLUCOSA:
        enviar_alerta_correo(user_email, user_id, glucosa_pred, fecha_entrada_formateada, "hiperglucemia")
    elif glucosa_pred < LIMITE_HIPOGLUCEMIA:
        enviar_alerta_correo(user_email, user_id, glucosa_pred, fecha_entrada_formateada, "hipoglucemia")

    print(f"Predicción de glucosa actualizada para el usuario {user_id} en Firestore.")