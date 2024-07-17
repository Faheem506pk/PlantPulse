import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  onValue
} from "firebase/database";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../assets/css/style.css"; // Adjust the path as needed
import Sidebar from "./sidebar";

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

const Dashboard = () => {
  const [temperature, setTemperature] = useState("--");
  const [humidity, setHumidity] = useState("--");

  useEffect(() => {
    // Fetching and displaying data
    const tempRef = ref(database, "DHT_11/Temperature");
    onValue(tempRef, (snapshot) => {
      setTemperature(snapshot.val());
    });

    const humiRef = ref(database, "DHT_11/Humidity");
    onValue(humiRef, (snapshot) => {
      setHumidity(snapshot.val());
    });
  }, []);

  const highchartsOptions = {
    colors: ["#ffffff"],
    chart: {
      type: "area",
      margin: [0, 0, 0, 0],
      backgroundColor: "transparent"
    },
    title: {
      text: ""
    },
    credits: {
      enabled: false
    },
    exporting: {
      enabled: false
    },
    xAxis: {
      min: 0,
      gridLineColor: "white",
      gridLineWidth: 0,
      lineColor: "white",
      categories: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
      labels: {
        style: {
          color: "white"
        }
      }
    },
    yAxis: {
      gridLineWidth: 0,
      title: {
        text: false
      },
      labels: {
        enabled: false
      }
    },
    legend: {
      enabled: false
    },
    plotOptions: {
      area: {
        dataLabels: {
          enabled: true,
          style: {
            fontWeight: "bold",
            textOutline: "none",
            color: "white"
          }
        },
        enableMouseTracking: false
      }
    },
    series: [
      {
        name: "Reggane",
        data: [16.0, 18.2, 23.1, 27.9, 32.2, 36.4, 39.8]
      }
    ]
  };

  return (
    <main className="main-wrapper">
      <div className="container">
        <div className="d-flex justify-content-center align-items-center">
          <div className="today-weather">
            <h1>Plant Pulse</h1>
            <h3 className="value" id="temperature">
              {temperature} &deg;C
            </h3>
            <p>Feels like 60°F</p>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="dashboard">
          <section className="content">
            <div className="row g-4">
              <div className="col-4">
              <div className="card ui-card p-3">
  <div className="card-body-2 p-0">
    <ul className="list-group hour-list">
      <li className="list-group-item d-flex justify-content-between align-items-center">
        Now
        <span className="deg">
          <i className="bi bi-brightness-high-fill"></i> 32&deg;C
        </span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center">
        11 PM
        <span className="deg"><i className="bi bi-brightness-high-fill"></i> 31&deg;C</span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center">
        12 PM
        <span className="deg"><i className="bi bi-brightness-high-fill"></i> 30&deg;C</span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center">
        01 AM
        <span className="deg"><i className="bi bi-brightness-high-fill"></i> 29&deg;C</span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center">
        02 AM
        <span className="deg"><i className="bi bi-brightness-high-fill"></i> 28&deg;C</span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center">
        03 AM
        <span className="deg"><i className="bi bi-brightness-high-fill"></i> 27&deg;C</span>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-center">
        04 AM
        <span className="deg"><i className="bi bi-brightness-high-fill"></i> 26&deg;C</span>
      </li>
    </ul>
  </div>
</div>

              </div>
              <div className="col-8">
              <div className="card ui-card h-100 overflow-hidden">
  <div className="card-body p-0" style={{ maxHeight: "270px", overflow: "hidden" }}>
    <HighchartsReact highcharts={Highcharts} options={highchartsOptions} />
  </div>
</div>



              </div>
              <div className="col-4">
                <div className="card ui-card h-100">
                  <div className="card-body">
                    <h5 className="card-title">Humidity</h5>
                    <div className="d-flex justify-content-center">
                      <div className="weather-data">
                        <div className="weather-icon">
                          <i className="bi bi-water"></i>
                        </div>
                        <h4 className="value" id="humidity">
                          {humidity}%
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="card ui-card h-100">
                  <div className="card-body">
                    <h5 className="card-title">Temperature</h5>
                    <div className="d-flex justify-content-center">
                      <div className="weather-data">
                        <div className="weather-icon">
                          <i className="bi bi-droplet-half"></i>
                        </div>
                        <h4 className="value" id="temperature">
                          {temperature} &deg;C
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="card ui-card h-100">
                  <div className="card-body">
                    <h5 className="card-title">Dew Point</h5>
                    <div className="d-flex justify-content-center">
                      <div className="weather-data">
                        <div className="weather-icon">
                          <i className="bi bi-wind"></i>
                        </div>
                        <h4>5 mph</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
