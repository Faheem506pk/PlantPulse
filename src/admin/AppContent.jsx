import React from 'react'
import { useFirebaseData } from "../hooks/useFirebaseData";
import { toast, ToastContainer } from "react-toastify";


const AppContent = () => {
  const { temperature, tempUp, tempDown, humidity, humidUp, humidDown,
    ldr, moisture, moistureUp, moistureDown, servo, servoAngle, setData } = useFirebaseData();

  return (
    <main >
      <div className="container">
        <div className="dashboard">
        <ToastContainer />
          <section className="content">
            <div className="row g-4">
            <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="card admin-ui-card h-100">
                  <div className="card-body">
                    <h5 className="admin-card-title">Temperature</h5>
                    <div className="d-flex justify-content-center ">
                      <div className="weather-data admin-card-title">
                        <div className="weather-icon">
                        <i class="bi bi-thermometer-half"></i>
                        </div>
                        <h4 className="value" id="temperature">
                          {temperature} &deg;C
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="card admin-ui-card h-100">
                  <div className="card-body">
                    <h5 className="admin-card-title">Humidity</h5>
                    <div className="d-flex justify-content-center">
                      <div className="weather-data admin-card-title">
                        <div className="weather-icon ">
                        <i className="bi bi-droplet-half"></i>
                        </div>
                        <h4 className="value" id="humidity">
                          {humidity}%
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
             
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="card admin-ui-card h-100">
                  <div className="card-body">
                    <h5 className="admin-card-title">Soil Moisture</h5>
                    <div className="d-flex justify-content-center">
                      <div className="weather-data admin-card-title">
                        <div className="weather-icon">
                        <i className="bi bi-water"></i>
                        </div>
                        <h4 className="value" id="moisture">
                          {moisture}%
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12">
              <div className="card admin-ui-card h-100">
                  <div className="card-body">
                    <h5 className="admin-card-title">Servo Motor</h5>
                    <div className="d-flex justify-content-center">
                      <div className="weather-data admin-card-title">
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
              <div className="col-lg-8 col-md-12 col-sm-12 mb-last">
                <div className="card admin-ui-card h-100 overflow-hidden">
                  <div className="card-body">
                    <h5 className="admin-card-title">LDR</h5>
                    <div className="d-flex justify-content-center ">
                      <div className="weather-data admin-card-title">
                        <div className="weather-icon">
                        {ldr === 'light' ? (
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
  )
}

export default AppContent;
