import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom/client";
import NavBar from "./Navbar";
import Sidebar from "./Sidebar";
import Map from "./Map";

export interface StateData {
  name: string;
  description: string;
}

const App: React.FC = () => {
  const [selectedState, setSelectedState] = useState<StateData | null>(null);

  const handleStateSelect = useCallback((data: StateData) => {
    setSelectedState(data);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSelectedState(null);
  }, []);

  return (
    <div>
      <NavBar />
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar 
          stateData={selectedState} 
          onClose={handleSidebarClose} 
        />
        <div className="w-full h-full">
          <Map onStateSelect={handleStateSelect} />
        </div>
      </div>
    </div>
  );
};

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(<App />);
}

export default App;