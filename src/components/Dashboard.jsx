import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useFirebaseData } from "../hooks/useFirebaseData";
import { useEsp32Data } from "../hooks/useEsp32Data";
import { toast, ToastContainer } from "react-toastify";
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

  const {
    writeTemperatureData,
    writeHumidityData,
    writeMoistureData,
    writeServoAngleData
  } = useEsp32Data();

  // State to track which card is expanded
  const [expandedCard, setExpandedCard] = useState(null);

  // States for the control inputs
  const [tempInput, setTempInput] = useState("");
  const [humidInput, setHumidInput] = useState("");
  const [moistureInput, setMoistureInput] = useState("");
  const [servoInput, setServoInput] = useState("");

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
                  className={`card ui-card h-100 ${expandedCard === "temperature" ? "expanded" : ""
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
                          <div className="temperature-details" onClick={(e) => e.stopPropagation()}>
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
                            <div className="mt-3">
                              <input
                                type="number"
                                className="form-control mb-2"
                                placeholder="Set Temp UP (2-40)"
                                value={tempInput}
                                onChange={(e) => setTempInput(e.target.value)}
                              />
                              <button
                                className="btn btn-primary btn-sm w-100"
                                onClick={() => {
                                  if (tempInput) {
                                    writeTemperatureData(tempInput);
                                    setTempInput("");
                                  } else {
                                    toast.warn("Please enter a value", { position: "top-center" });
                                  }
                                }}
                              >
                                Set Temperature
                              </button>
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
                  className={`card ui-card h-100 ${expandedCard === "humidity" ? "expanded" : ""
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
                          <div className="humidity-details" onClick={(e) => e.stopPropagation()}>
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
                            <div className="mt-3">
                              <input
                                type="number"
                                className="form-control mb-2"
                                placeholder="Set Humidity UP (10-100)"
                                value={humidInput}
                                onChange={(e) => setHumidInput(e.target.value)}
                              />
                              <button
                                className="btn btn-primary btn-sm w-100"
                                onClick={() => {
                                  if (humidInput) {
                                    writeHumidityData(humidInput);
                                    setHumidInput("");
                                  } else {
                                    toast.warn("Please enter a value", { position: "top-center" });
                                  }
                                }}
                              >
                                Set Humidity
                              </button>
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
                  className={`card ui-card h-100 ${expandedCard === "moisture" ? "expanded" : ""
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
                          <div className="moisture-details" onClick={(e) => e.stopPropagation()}>
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
                            <div className="mt-3">
                              <input
                                type="number"
                                className="form-control mb-2"
                                placeholder="Set Moisture UP (20-100)"
                                value={moistureInput}
                                onChange={(e) => setMoistureInput(e.target.value)}
                              />
                              <button
                                className="btn btn-primary btn-sm w-100"
                                onClick={() => {
                                  if (moistureInput) {
                                    writeMoistureData(moistureInput);
                                    setMoistureInput("");
                                  } else {
                                    toast.warn("Please enter a value", { position: "top-center" });
                                  }
                                }}
                              >
                                Set Moisture
                              </button>
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
                <div className={`card ui-card h-100 ${expandedCard === "servo" ? "expanded" : ""
                  }`}
                  onClick={() => handleCardClick("servo")}>
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
                        {expandedCard === "servo" && (
                          <div className="servo-details mt-3" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="number"
                              className="form-control mb-2"
                              placeholder="Set Angle (0-90)"
                              value={servoInput}
                              onChange={(e) => setServoInput(e.target.value)}
                            />
                            <button
                              className="btn btn-primary btn-sm w-100"
                              onClick={() => {
                                if (servoInput) {
                                  writeServoAngleData(servoInput);
                                  setServoInput("");
                                } else {
                                  toast.warn("Please enter an angle", { position: "top-center" });
                                }
                              }}
                            >
                              Set Angle
                            </button>
                          </div>
                        )}
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
