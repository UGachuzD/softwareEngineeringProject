import pandas as pd
import joblib
import matplotlib.pyplot as plt

def procesar_glucosa(csv_file):
    df = pd.read_csv(csv_file)
    try:
        modelo_diabetes = joblib.load('BackEnd/model_random_forest.pkl')
    except FileNotFoundError:
        print("Modelo no encontrado.")
        return

    user_id = csv_file.split('/')[-1].split('_')[0]  # Extrae el user_id del nombre del archivo
    features = df[["calories", "heart_rate", "steps", "basal_rate", "bolus_volume_delivered", "carb_input"]]
    df['Glucosa'] = modelo_diabetes.predict(features)

    df_result = df[["date", "Glucosa"]]
    output_csv_path = f'BackEnd/SalidasGlucosa/{user_id}_glucosa_output.csv'
    df_result.to_csv(output_csv_path, index=False)

    plt.figure(figsize=(12, 6))
    plt.plot(df_result['date'], df_result['Glucosa'], marker='o', color='b', label='Glucosa')
    plt.xticks(rotation=90)
    plt.xlabel("Fecha")
    plt.ylabel("Nivel de Glucosa")
    plt.title("Nivel de Glucosa vs Fecha")
    plt.legend()
    plt.tight_layout()
    plt.savefig(f'BackEnd/SalidasImagenes/{user_id}_salida.jpg')
