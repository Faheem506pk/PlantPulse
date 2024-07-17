import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashbord";
import Sidebar from "./components/sidebar";
import Topbar from "./components/Topbar";
import Graphs from "./components/Graphs";

function App() {
  return (
    <Router>
      <div className="App">
        <Topbar />
        <div className="main-layout">
          <Sidebar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/graphs" element={<Graphs />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
