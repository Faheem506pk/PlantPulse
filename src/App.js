import React from "react";
import Dashboard from "./components/Dashbord";
import Sidebar from "./components/sidebar";

function App() {
  return (
    <div className="App">
      <Sidebar />
      <div className="main-content">
        <Dashboard />
      </div>
    </div>
  );
}

export default App;
