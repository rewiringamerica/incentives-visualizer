import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import React, { useEffect, useRef } from 'react';
import '../styles/index.css';
import { CountyData, loadCounties } from './Counties';
import Legend from './Legend';
import { loadStates, StateData } from './States';

interface MapProps {
  onStateSelect?: (data: StateData) => void;
  onCountySelect?: (data: CountyData) => void;
}

const Map: React.FC<MapProps> = ({ onStateSelect, onCountySelect }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  const mapRef = useRef<maplibregl.Map | null>(null);

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

    mapRef.current = map;

    map.on('load', () => {
      // Load states and pass the onStateSelect callback so a state click will notify the parent.
      loadCounties(map, onCountySelect);
      loadStates(map, onStateSelect);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [onStateSelect, onCountySelect]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      <Legend map={mapRef.current} />
    </div>
  );
};

export default Map;
