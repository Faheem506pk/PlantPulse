// src/hooks/useFirebaseData.js

import { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

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
  const [humidity, setHumidity] = useState("--");

  useEffect(() => {
    const tempRef = ref(database, "DHT_11/Temperature");
    onValue(tempRef, (snapshot) => {
      setTemperature(snapshot.val());
    });

    const humiRef = ref(database, "DHT_11/Humidity");
    onValue(humiRef, (snapshot) => {
      setHumidity(snapshot.val());
    });
  }, []);

  return { temperature, humidity };
};
