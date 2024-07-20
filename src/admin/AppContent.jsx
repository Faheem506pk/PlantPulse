import React from 'react'





const AppContent = () => {
  return (
    <main >
      <div className="container">
        <div className="dashboard">
          <section className="content">
            <div className="row g-4">
            <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="card ui-card h-100">
                  <div className="card-body">
                    <h5 className="card-title">Temperature</h5>
                    <div className="d-flex justify-content-center">
                      <div className="weather-data">
                        <div className="weather-icon">
                        <i class="bi bi-thermometer-half"></i>
                        </div>
                        <h4 className="value" id="temperature">
                          
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="card ui-card h-100">
                  <div className="card-body">
                    <h5 className="card-title">Humidity</h5>
                    <div className="d-flex justify-content-center">
                      <div className="weather-data">
                        <div className="weather-icon">
                        <i className="bi bi-droplet-half"></i>
                        </div>
                        <h4 className="value" id="humidity">
                          
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
             
              <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="card ui-card h-100">
                  <div className="card-body">
                    <h5 className="card-title">Soil Moisture</h5>
                    <div className="d-flex justify-content-center">
                      <div className="weather-data">
                        <div className="weather-icon">
                        <i className="bi bi-water"></i>
                        </div>
                        <h4 className="value" id="moisture">
                         
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                        
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-md-12 col-sm-12">
                <div className="card ui-card h-100 overflow-hidden">
                  <div className="card-body">
                    <h5 className="card-title">LDR</h5>
                   
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
