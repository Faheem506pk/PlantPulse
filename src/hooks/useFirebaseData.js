// src/hooks/useFirebaseData.js

import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, set } from "firebase/database";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABefD1-K7aCtUhEtsip9TYJJjOUl_YOpg",
  authDomain: "esp32-1b972.firebaseapp.com",
  databaseURL: "https://esp32-1b972-default-rtdb.firebaseio.com",
  projectId: "esp32-1b972",
  storageBucket: "esp32-1b972.appspot.com",
  messagingSenderId: "438774419341",
  appId: "1:438774419341:web:576032b2fefac98e86b7c4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export const useFirebaseData = () => {
  const [temperature, setTemperature] = useState("--");
  const [tempUp, setTempUp] = useState("--");
  const [tempDown, setTempDown] = useState("--");
  const [humidity, setHumidity] = useState("--");
  const [humidUp, setHumidUp] = useState("--");
  const [humidDown, setHumidDown] = useState("--");
  const [ldr, setLdr] = useState("--");
  const [moisture, setMoisture] = useState("--");
  const [moistureUp, setMoistureUp] = useState("--");
  const [moistureDown, setMoistureDown] = useState("--");
  const [servo, setServo] = useState("--");
  const [servoAngle, setServoAngle] = useState("--");

  useEffect(() => {
    const tempRef = ref(database, "DHT_11/Temperature");
    onValue(tempRef, (snapshot) => setTemperature(snapshot.val()));

    const tempUpRef = ref(database, "tempup");
    onValue(tempUpRef, (snapshot) => setTempUp(snapshot.val()));

    const tempDownRef = ref(database, "tempdown");
    onValue(tempDownRef, (snapshot) => setTempDown(snapshot.val()));

    const humiRef = ref(database, "DHT_11/Humidity");
    onValue(humiRef, (snapshot) => setHumidity(snapshot.val()));

    const humidUpRef = ref(database, "humidup");
    onValue(humidUpRef, (snapshot) => setHumidUp(snapshot.val()));

    const humidDownRef = ref(database, "humiddown");
    onValue(humidDownRef, (snapshot) => setHumidDown(snapshot.val()));

    const ldrRef = ref(database, "LDR");
    onValue(ldrRef, (snapshot) => setLdr(snapshot.val()));

    const moistureRef = ref(database, "Moisture");
    onValue(moistureRef, (snapshot) => setMoisture(snapshot.val()));

    const moistureUpRef = ref(database, "Moistureup");
    onValue(moistureUpRef, (snapshot) => setMoistureUp(snapshot.val()));

    const moistureDownRef = ref(database, "Moisturedown");
    onValue(moistureDownRef, (snapshot) => setMoistureDown(snapshot.val()));

    const servoRef = ref(database, "servo");
    onValue(servoRef, (snapshot) => setServo(snapshot.val()));

    const servoAngleRef = ref(database, "servoangle");
    onValue(servoAngleRef, (snapshot) => setServoAngle(snapshot.val()));
  }, []);

  const setData = (path, value) => {
    set(ref(database, path), value);
  };

  return {
    temperature, tempUp, tempDown, humidity, humidUp, humidDown,
    ldr, moisture, moistureUp, moistureDown, servo, servoAngle, setData
  };
};

export const auth=getAuth();
export const db=getFirestore(app);
export default app;