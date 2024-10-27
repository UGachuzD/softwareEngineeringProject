// Importa las funciones necesarias
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage"; 

import {
  REACT_FIREBASE_API_KEY,
  REACT_FIREBASE_AUTH_DOMAIN,
  REACT_FIREBASE_PROJECT_ID,
  REACT_FIREBASE_STORAGE_BUCKET,
  REACT_FIREBASE_MESSAGING_SENDER_ID,
  REACT_FIREBASE_APP_ID,
  REACT_FIREBASE_MEASUREMENT_ID,
} from "@env";

const firebaseConfig = {
  apiKey: REACT_FIREBASE_API_KEY,
  authDomain: REACT_FIREBASE_AUTH_DOMAIN,
  projectId: REACT_FIREBASE_PROJECT_ID,
  storageBucket: REACT_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: REACT_FIREBASE_MESSAGING_SENDER_ID,
  appId: REACT_FIREBASE_APP_ID,
  measurementId: REACT_FIREBASE_MEASUREMENT_ID,
};

const appFirebase = initializeApp(firebaseConfig);

export const auth = initializeAuth(appFirebase, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const firestore = getFirestore(appFirebase);
