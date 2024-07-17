// src/components/Topbar.jsx

import React from "react";
import { useFirebaseData } from "../hooks/useFirebaseData";

const Topbar = () => {
  const { temperature } = useFirebaseData();

  return (
    <div className="Topbar">
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
  );
};

export default Topbar;
