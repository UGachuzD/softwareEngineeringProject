import pandas as pd
import joblib
import matplotlib.pyplot as plt

def procesar_glucosa(csv_file):
    # Cargar datos desde el archivo CSV proporcionado como parámetro
    df = pd.read_csv(csv_file)

    # Cargar el modelo de predicción de glucosa
    try:
        modelo_diabetes = joblib.load('BackEnd/model_random_forest.pkl')
    except FileNotFoundError:
        print("Modelo no encontrado. Por favor asegúrate de que el archivo 'model_random_forest.pkl' esté disponible.")
        return

    # Aplicar el modelo y obtener valores de glucosa si el modelo está disponible
    features = df[["calories", "heart_rate", "steps", "basal_rate", "bolus_volume_delivered", "carb_input"]]
    df['Glucosa'] = modelo_diabetes.predict(features)

    # Guardar resultados con fecha y glucosa en un nuevo CSV
    df_result = df[["date", "Glucosa"]]
    df_result.to_csv('BackEnd/glucosa_output.csv', index=False)

    # Graficar los resultados
    plt.figure(figsize=(12, 6))
    plt.plot(df_result['date'], df_result['Glucosa'], marker='o', color='b', label='Glucosa')
    plt.xticks(rotation=90)  # Poner las fechas en vertical
    plt.xlabel("Fecha")
    plt.ylabel("Nivel de Glucosa")
    plt.title("Nivel de Glucosa vs Fecha")
    plt.legend()
    plt.tight_layout()
    plt.savefig('BackEnd/salida.jpg')  # Guardar como 'salida.jpg'
    #plt.show()
