import React, { useCallback, useState } from 'react';
import ReactDOM from 'react-dom/client';
import Map from './Map';
import NavBar from './Navbar';
import Sidebar from './Sidebar';

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
    <div>
      <NavBar />
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar stateData={selectedState} />
        <div className="w-full h-full">
          <Map onStateSelect={handleStateSelect} />
        </div>
      </div>
    </div>
  );
};

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(<App />);
}

export default App;
