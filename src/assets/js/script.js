// Import Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyABefD1-K7aCtUhEtsip9TYJJjOUl_YOpg",
    authDomain: "esp32-1b972.firebaseapp.com",
    databaseURL: "https://esp32-1b972-default-rtdb.firebaseio.com",
    projectId: "esp32-1b972",
    storageBucket: "esp32-1b972.appspot.com",
    messagingSenderId: "438774419341",
    appId: "1:438774419341:web:576032b2fefac98e86b7c4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Getting reference to the data we want
const dataRefs = {
    temp: ref(database, 'DHT_11/Temperature'),
    tempUp: ref(database, 'tempup'),
    tempDown: ref(database, 'tempdown'),
    humi: ref(database, 'DHT_11/Humidity'),
    humidUp: ref(database, 'humidup'),
    humidDown: ref(database, 'humiddown'),
    ldr: ref(database, 'LDR'),
    moisture: ref(database, 'Moisture'),
    moistureUp: ref(database, 'Moistureup'),
    moistureDown: ref(database, 'Moisturedown'),
    servo: ref(database, 'servo'),
    servoAngle: ref(database, 'servoangle')
};

// Fetching and displaying data
onValue(dataRefs.temp, (snapshot) => {
    document.getElementById('temperature').innerHTML = `${snapshot.val()}&deg;C`;
});
onValue(dataRefs.tempUp, (snapshot) => {
    document.getElementById('tempup').innerHTML = `${snapshot.val()}&deg;C`;
});
onValue(dataRefs.tempDown, (snapshot) => {
    document.getElementById('tempdown').innerHTML = `${snapshot.val()}&deg;C`;
});
onValue(dataRefs.humi, (snapshot) => {
    document.getElementById('humidity').innerHTML = `${snapshot.val()}%`;
});
onValue(dataRefs.humidUp, (snapshot) => {
    document.getElementById('humidup').innerHTML = `${snapshot.val()}%`;
});
onValue(dataRefs.humidDown, (snapshot) => {
    document.getElementById('humiddown').innerHTML = `${snapshot.val()}%`;
});
onValue(dataRefs.ldr, (snapshot) => {
    document.getElementById('LDR').innerHTML = `It is ${snapshot.val()}`;
});
onValue(dataRefs.moisture, (snapshot) => {
    document.getElementById('Moisture').innerHTML = `${snapshot.val()}%`;
});
onValue(dataRefs.moistureUp, (snapshot) => {
    document.getElementById('Moistureup').innerHTML = `${snapshot.val()}%`;
});
onValue(dataRefs.moistureDown, (snapshot) => {
    document.getElementById('Moisturedown').innerHTML = `${snapshot.val()}%`;
});
onValue(dataRefs.servo, (snapshot) => {
    document.getElementById('servo').innerHTML = `${snapshot.val()}&deg;`;
});
onValue(dataRefs.servoAngle, (snapshot) => {
    document.getElementById('servoangle').innerHTML = `${snapshot.val()}&deg;`;
});

// Event listeners for setting data
document.getElementById("tempBtn").addEventListener("click", function () {
    if (validateInput("tempupset")) {
        writeTemperatureData();
    } else {
        alert("Please fill 'UP' temperature value.");
    }
});

document.getElementById("humidBtn").addEventListener("click", function () {
    if (validateInput("humidupset")) {
        writeHumidityData();
    } else {
        alert("Please fill 'UP' humidity value.");
    }
});

document.getElementById("moistureBtn").addEventListener("click", function () {
    if (validateInput("moistureupset")) {
        writeMoistureData();
    } else {
        alert("Please fill 'UP' moisture value.");
    }
});

document.getElementById("servoBtn").addEventListener("click", function () {
    if (validateInput("servoangleset")) {
        writeServoAngleData();
    } else {
        alert("Please fill Servo Angle.");
    }
});

// Validation function
function validateInput(inputId) {
    var inputValue = document.getElementById(inputId).value;
    return inputValue.trim() !== '';
}

// Functions to write data to Firebase
function writeTemperatureData() {
    var tempupValue = document.getElementById("tempupset").value;
    if (validateFloat(tempupValue) && parseFloat(tempupValue) >= 2 && parseFloat(tempupValue) <= 40) {
        set(dataRefs.tempUp, parseFloat(tempupValue));
        set(dataRefs.tempDown, parseFloat(tempupValue) - 2);
    } else {
        alert("Temperature values must be between 2 and 40.");
    }
}

function writeHumidityData() {
    var humidupValue = document.getElementById("humidupset").value;
    if (validateFloat(humidupValue) && parseInt(humidupValue) >= 10 && parseInt(humidupValue) <= 100) {
        set(dataRefs.humidUp, parseInt(humidupValue));
        set(dataRefs.humidDown, parseInt(humidupValue) - 10);
    } else {
        alert("Humidity value must be between 10 and 100.");
    }
}

function writeMoistureData() {
    var moistureupValue = document.getElementById("moistureupset").value;
    if (validateFloat(moistureupValue) && parseInt(moistureupValue) >= 20 && parseInt(moistureupValue) <= 100) {
        set(dataRefs.moistureUp, parseInt(moistureupValue));
        set(dataRefs.moistureDown, parseInt(moistureupValue) - 20);
    } else {
        alert("Moisture value must be between 20 and 100.");
    }
}

function writeServoAngleData() {
    var servoangleValue = document.getElementById("servoangleset").value;
    if (validateFloat(servoangleValue) && parseInt(servoangleValue) >= 0 && parseInt(servoangleValue) <= 90) {
        set(dataRefs.servoAngle, parseInt(servoangleValue));
    } else {
        alert("Servo Angle value must be between 0 and 90.");
    }
}

// Validation function for float input
function validateFloat(value) {
    return /^\d+(\.\d+)?$/.test(value.trim());
}

// Function to set the theme
const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
};

// Function to save theme preference in localStorage
const saveTheme = (theme) => {
    localStorage.setItem('theme', theme);
};

// Function to load theme on page load
const loadTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme) {
        setTheme(savedTheme);
        // Update dropdown selection if saved theme exists
        const dropdownToggle = document.getElementById('theme-toggle');
        const dropdownItems = dropdownToggle.nextElementSibling.querySelectorAll('.dropdown-item');
        dropdownItems.forEach(item => {
            if (item.dataset.theme === savedTheme) {
                dropdownToggle.textContent = item.textContent.trim();
            }
        });
    } else {
        // Set theme based on system preference if no saved theme
        setTheme(systemPrefersDark ? 'dark' : 'light');
        // Update dropdown selection based on system preference
        const defaultTheme = systemPrefersDark ? 'dark' : 'light';
        const dropdownToggle = document.getElementById('theme-toggle');
        dropdownToggle.textContent = defaultTheme.charAt(0).toUpperCase() + defaultTheme.slice(1); // Capitalize first letter
    }
};

// Load theme on page load
loadTheme();

// Event listener for theme selection dropdown
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', (event) => {
        const theme = event.target.dataset.theme;
        setTheme(theme);
        saveTheme(theme);
        document.getElementById('theme-toggle').textContent = event.target.textContent.trim(); // Update dropdown toggle text
    });
});



