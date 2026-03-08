// src/hooks/useEsp32Data.js

import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";

// Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_ESP32_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_ESP32_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_ESP32_FIREBASE_DATABASE_URL,
    projectId: import.meta.env.VITE_ESP32_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_ESP32_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_ESP32_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_ESP32_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig, "esp32"); // Use a named app instance
const database = getDatabase(app);

import { toast } from "react-toastify";

export const useEsp32Data = () => {
    
    const writeTemperatureData = (tempupValue) => {
        if (validateFloat(tempupValue) && parseFloat(tempupValue) >= 2 && parseFloat(tempupValue) >= 2 && parseFloat(tempupValue) <= 40) {
            set(ref(database, 'tempup'), parseFloat(tempupValue));
            set(ref(database, 'tempdown'), parseFloat(tempupValue) - 2);
        } else {
            toast.error("Temperature values must be between 2 and 40.");
        }
    }

    const writeHumidityData = (humidupValue) => {
        if (validateFloat(humidupValue) && parseInt(humidupValue) >= 10 && parseInt(humidupValue) <= 100) {
            set(ref(database, 'humidup'), parseInt(humidupValue));
            set(ref(database, 'humiddown'), parseInt(humidupValue) - 10);
        } else {
            toast.error("Humidity value must be between 10 and 100.");
        }
    }

    const writeMoistureData = (moistureupValue) => {
        if (validateFloat(moistureupValue) && parseInt(moistureupValue) >= 20 && parseInt(moistureupValue) <= 100) {
            set(ref(database, 'Moistureup'), parseInt(moistureupValue));
            set(ref(database, 'Moisturedown'), parseInt(moistureupValue) - 20);
        } else {
            toast.error("Moisture value must be between 20 and 100.");
        }
    }

    const writeServoAngleData = (servoangleValue) => {
        const val = parseInt(servoangleValue);
        if (validateFloat(servoangleValue) && val >= 0 && val <= 180) {
            set(ref(database, 'servoangle'), val);
        } else {
            toast.error("Servo Angle value must be between 0 and 180.");
        }
    }

    const writeAutoWateringData = (state) => {
        set(ref(database, 'autoWatering'), state);
    }

    const writeGrowLightsData = (state) => {
        set(ref(database, 'growLights'), state);
    }

    const validateFloat = (value) => {
        if (value === null || value === undefined) return false;
        const strVal = String(value).trim();
        if (strVal === "") return false;
        return !isNaN(parseFloat(strVal)) && isFinite(strVal);
    }

    return {
        writeTemperatureData,
        writeHumidityData,
        writeMoistureData,
        writeServoAngleData,
        writeAutoWateringData,
        writeGrowLightsData
    };
};
