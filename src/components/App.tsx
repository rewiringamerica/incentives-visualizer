import maplibregl from 'maplibre-gl';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { CountyData, loadCounties } from './Counties';
import Legend from './Legend';
import NavBar from './Navbar';
import Sidebar from './Sidebar';
import { loadStates, StateData, zoomToState } from './States';

const App: React.FC = () => {
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [selectedCounty, setSelectedCounty] = useState<CountyData | null>(null);

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

  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
  const STYLE_VERSION = 8; // Required for declaring a style, may change in the future

  useEffect(() => {
    if (!mapContainer.current) {
      return;
    }
    const API_KEY = process.env.MAPTILER_API_KEY;
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: STYLE_VERSION,
        sources: {},
        layers: [],
        glyphs: `https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=${API_KEY}`,
      },
      center: [0, 0],
      zoom: 4.2,
      maxBounds: [
        [-25, -15], // Southwest corner, Mainland USA
        [25, 15], // Northeast corner, Mainland USA
      ],
    });

    map.on('load', () => {
      // Load states and pass the onStateSelect callback so a state click will notify the parent.
      loadCounties(map, handleCountySelect);
      loadStates(map, handleStateSelect);
      setMapInstance(map);
    });

    return () => map.remove();
  }, [handleStateSelect]);

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
          <div className="relative w-full h-full">
            <div
              ref={mapContainer}
              className="absolute inset-0 w-full h-full"
            />
            <Legend map={mapInstance} />
          </div>
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
