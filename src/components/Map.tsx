import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import React, { useEffect, useRef, useState } from 'react';
import '../styles/index.css';
import { loadCounties } from './Counties';
import Legend from './Legend';
import MapHighlights from './MapHighlights';
import { loadStates, updateStatesVisibility } from './States';
import Toggle from './Toggle';

interface MapProps {
  onStateSelect?: (feature: maplibregl.MapGeoJSONFeature) => void;
  onCountySelect?: (feature: maplibregl.MapGeoJSONFeature) => void;
  mapInstance: maplibregl.Map | null;
  onMapSet: React.Dispatch<React.SetStateAction<maplibregl.Map | null>>;
  selectedState: maplibregl.MapGeoJSONFeature | null;
  selectedCounty: maplibregl.MapGeoJSONFeature | null;
  isVisible: boolean;
}

const Map: React.FC<MapProps> = ({
  onStateSelect,
  onCountySelect,
  mapInstance,
  onMapSet,
  selectedState,
  selectedCounty,
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
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
      loadCounties(map, onCountySelect);
      loadStates(map, onStateSelect);
      onMapSet(map);
    });

    return () => map.remove();
  }, [onStateSelect, onCountySelect, onMapSet]);

  useEffect(() => {
    if (mapInstance) {
      updateStatesVisibility(mapInstance, isVisible);
    }
  }, [mapInstance, isVisible]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      <Toggle map={mapInstance} isVisible={isVisible} onToggle={setIsVisible} />
      <Legend map={mapInstance} isVisible={isVisible} />
      <MapHighlights
        map={mapInstance}
        selectedState={selectedState}
        selectedCounty={selectedCounty}
      />
    </div>
  );
};

export default Map;
