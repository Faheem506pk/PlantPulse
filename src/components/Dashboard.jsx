import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useFirebaseData } from "../hooks/useFirebaseData";
import "../assets/css/style.css"; // Adjust the path as needed

const Dashboard = () => {
  const {
    temperature,
    tempUp,
    tempDown,
    humidity,
    humidUp,
    humidDown,
    ldr,
    moisture,
    moistureUp,
    moistureDown,
    servo,
    servoAngle,
    setData,
  } = useFirebaseData();

  // State to track which card is expanded
  const [expandedCard, setExpandedCard] = useState(null);

  // Toggle expanded state for a card
  const handleCardClick = (cardType) => {
    setExpandedCard(expandedCard === cardType ? null : cardType);
  };

  return (
    <main className="main-wrapper">
      <div className="container">
        <div className="dashboard">
        <ToastContainer />
          <section className="content">
            <div className="row g-4">
              {/* Temperature Card */}
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div
                  className={`card ui-card h-100 ${
                    expandedCard === "temperature" ? "expanded" : ""
                  }`}
                  onClick={() => handleCardClick("temperature")}
                >
                  <div className="card-body">
                    <h5 className="card-title">Temperature</h5>
                    <div className="d-flex justify-content-center">
                      <div className="weather-data">
                        <div className="weather-icon">
                          <i className="bi bi-thermometer-half"></i>
                        </div>
                        <h4 className="value" id="temperature">
                          {temperature} &deg;C
                        </h4>
                        {expandedCard === "temperature" && (
                          <div className="temperature-details">
                            <div className="temperature-row gap-5">
                              <div className="temperature-label">
                                <h5>Temperature Up:</h5>
                                <p>{tempUp} &deg;C</p>
                              </div>
                              <div className="temperature-label">
                                <h5>Temperature Down:</h5>
                                <p>{tempDown} &deg;C</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Humidity Card */}
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div
                  className={`card ui-card h-100 ${
                    expandedCard === "humidity" ? "expanded" : ""
                  }`}
                  onClick={() => handleCardClick("humidity")}
                >
                  <div className="card-body">
                    <h5 className="card-title">Humidity</h5>
                    <div className="d-flex justify-content-center">
                      <div className="weather-data">
                        <div className="weather-icon">
                          <i className="bi bi-droplet-half"></i>
                        </div>
                        <h4 className="value" id="humidity">
                          {humidity}%
                        </h4>
                        {expandedCard === "humidity" && (
                          <div className="humidity-details">
                            <div className="humidity-row gap-5">
                              <div className="humidity-label">
                                <h5>Humidity Up:</h5>
                                <p>{humidUp}%</p>
                              </div>
                              <div className="humidity-label">
                                <h5>Humidity Down:</h5>
                                <p>{humidDown}%</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Soil Moisture Card */}
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div
                  className={`card ui-card h-100 ${
                    expandedCard === "moisture" ? "expanded" : ""
                  }`}
                  onClick={() => handleCardClick("moisture")}
                >
                  <div className="card-body">
                    <h5 className="card-title">Soil Moisture</h5>
                    <div className="d-flex justify-content-center">
                      <div className="weather-data">
                        <div className="weather-icon">
                          <i className="bi bi-water"></i>
                        </div>
                        <h4 className="value" id="moisture">
                          {moisture}%
                        </h4>
                        {expandedCard === "moisture" && (
                          <div className="moisture-details">
                            <div className="moisture-row gap-5">
                              <div className="moisture-label">
                                <h5>Moisture Up:</h5>
                                <p>{moistureUp}%</p>
                              </div>
                              <div className="moisture-label">
                                <h5>Moisture Down:</h5>
                                <p>{moistureDown}%</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Servo Motor Card */}
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="card ui-card h-100">
                  <div className="card-body">
                    <h5 className="card-title">Servo Motor</h5>
                    <div className="d-flex justify-content-center">
                      <div className="weather-data">
                        <div className="weather-icon">
                          <i className="bi bi-gear"></i>
                        </div>
                        <h4 className="value" id="servo">
                          {servo} &deg;
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* LDR Card */}
              <div className="col-lg-8 col-md-12 col-sm-12 mb-last">
                <div className="card ui-card h-100 overflow-hidden">
                  <div className="card-body">
                    <h5 className="card-title">LDR</h5>
                    <div className="d-flex justify-content-center">
                      <div className="weather-data">
                        <div className="weather-icon">
                          {ldr === "light" ? (
                            <i className="bi bi-lightbulb-fill"></i>
                          ) : (
                            <i className="bi bi-lightbulb"></i>
                          )}
                        </div>
                        <h4 className="value" id="LDR">
                          It is {ldr}
                        </h4>
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
