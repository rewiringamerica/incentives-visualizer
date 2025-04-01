import React, { useCallback, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { CountyData } from './Counties';
import Map from './Map';
import NavBar from './Navbar';
import Sidebar from './Sidebar';
import { StateData, zoomToState } from './States';

const App: React.FC = () => {
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<CountyData | null>(null);
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);

  const handleStateSelect = useCallback((data: StateData) => {
    setSelectedState(data);
    setSelectedCounty(null); // Clear county selection when state is selected
  }, []);

  const handleCountySelect = useCallback((data: CountyData) => {
    setSelectedCounty(data);
    setSelectedState(null); // Clear state selection when county is selected
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSelectedState(null);
    setSelectedCounty(null);
  }, []);

  const handleSetMapInstance = useCallback((map: maplibregl.Map) => {
    setMapInstance(map);
  }, []);

  return (
    <div>
      <NavBar
        map={mapInstance}
        zoomToState={zoomToState}
        onStateSelect={handleStateSelect}
      />
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar
          stateData={selectedState}
          countyData={selectedCounty}
          onClose={handleSidebarClose}
        />
        <div className="w-full h-full">
          <Map
            onStateSelect={handleStateSelect}
            onCountySelect={handleCountySelect}
            mapInstance={mapInstance}
            onMapSet={handleSetMapInstance}
          />
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
