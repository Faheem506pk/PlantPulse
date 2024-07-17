import React from "react";
import Dashboard from "./components/Dashbord";
import Sidebar from "./components/sidebar";
import Topbar from "./components/Topbar";

function App() {
  return (
    <div className="App">
      <Topbar />
      <div className="main-layout">
        <Sidebar />
        <div className="main-content">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default App;
