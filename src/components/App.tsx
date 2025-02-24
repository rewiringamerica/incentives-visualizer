import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom/client";
import Map from "./Map";
import Sidebar from "./Sidebar";

export interface StateData {
  name: string;
  description: string;
}

const App: React.FC = () => {
  const [selectedState, setSelectedState] = useState<StateData | null>(null);

  const handleStateSelect = useCallback((data: StateData) => {
    setSelectedState(data);
  }, []);

  return (
    <div className="flex h-full">
      <Sidebar stateData={selectedState} />
      <div className="w-full h-full">
        <Map onStateSelect={handleStateSelect} />
      </div>
    </div>
  );
};

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(<App />);
}

export default App;