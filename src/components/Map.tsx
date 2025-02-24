import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "../styles/index.css";
import loadStates from "./States";
import MapButtons from "./MapButtons";
import { StateData } from "./States";
import Legend from './Legend.tsx';

interface MapProps {
  onStateSelect?: (data: StateData) => void;
}

const Map: React.FC<MapProps> = ({ onStateSelect }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [mapStyle, setMapStyle] = useState<maplibregl.StyleSpecification | null>(null);
  
  useEffect(() => {
    if (!mapContainer.current) return;
    const API_KEY = process.env.MAPTILER_API_KEY;
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
      center: [-98.5795, 39.8283], // USA-center
      zoom: 4,
      maxBounds: [
        [-130, 23], // Southwest corner, Mainland USA
        [-65, 50],  // Northeast corner, Mainland USA
      ],
    });

    map.on("load", () => {
      // Load states and pass the onStateSelect callback so a state click will notify the parent.
      loadStates(map, onStateSelect);
      setMapStyle(map.getStyle());
    });

    mapRef.current = map;
    return () => map.remove();
  }, [onStateSelect]);

  const setMapView = (
    center: [number, number],
    maxBounds: [[number, number], [number, number]]
  ) => {
    if (mapRef.current) {
      mapRef.current.setMaxBounds(maxBounds);
      mapRef.current.flyTo({ center, zoom: 4 });
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      {mapStyle && <MapButtons setMapView={setMapView} mapStyle={mapStyle} />}
      <Legend /> {/* Add the legend here */}
    </div>
  );
};

export default Map;