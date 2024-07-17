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
        </div>
      </div>
    </div>
  );
};

export default Topbar;



