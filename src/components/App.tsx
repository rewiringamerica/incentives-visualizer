import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { zoomToCounty } from './Counties';
import Map from './Map';
import NavBar from './Navbar';
import Sidebar from './Sidebar';
import { zoomToState } from './States';

const App: React.FC = () => {
  const [selectedState, setSelectedState] =
    useState<maplibregl.MapGeoJSONFeature | null>(null);
  const [selectedCounty, setSelectedCounty] =
    useState<maplibregl.MapGeoJSONFeature | null>(null);
  const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);

  const handleStateSelect = useCallback(
    (feature: maplibregl.MapGeoJSONFeature) => {
      setSelectedState(feature);
      setSelectedCounty(null); // Clear county selection when state is selected
    },
    [],
  );

  const handleCountySelect = useCallback(
    (feature: maplibregl.MapGeoJSONFeature) => {
      setSelectedCounty(feature);
      setSelectedState(null); // Clear state selection when county is selected
    },
    [],
  );

  const handleSidebarClose = useCallback(() => {
    setSelectedState(null);
    setSelectedCounty(null);
  }, []);

  const handleSetMapInstance = useCallback((map: maplibregl.Map) => {
    setMapInstance(map);
  }, []);

  const queryClient = new QueryClient();

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <NavBar
          map={mapInstance}
          zoomToState={zoomToState}
          zoomToCounty={zoomToCounty}
          onStateSelect={handleStateSelect}
          onCountySelect={handleCountySelect}
        />
        <div className="flex h-[calc(100vh-64px)]">
          <Sidebar
            selectedFeature={selectedState || selectedCounty}
            onClose={handleSidebarClose}
          />
          <div className="w-full h-full">
            <Map
              onStateSelect={handleStateSelect}
              onCountySelect={handleCountySelect}
              mapInstance={mapInstance}
              onMapSet={handleSetMapInstance}
              selectedState={selectedState}
              selectedCounty={selectedCounty}
            />
          </div>
        </div>
      </QueryClientProvider>
    </div>
  );
};

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(<App />);
}

export default App;
