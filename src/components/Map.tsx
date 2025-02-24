import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import '../styles/index.css';
import loadStates from "./States";
import Legend from "./Legend"; // Import the Legend component

const Map: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    const API_KEY = process.env.MAPTILER_API_KEY
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`, // Demo tiles, use MapTiler later
      center: [-98.5795, 39.8283], // USA-center
      zoom: 4,
    });

    return () => map.remove();
  }, []);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      <Legend /> {}
    </div>
  );
};

const mapContainer = document.getElementById("map-container");

if (mapContainer) {
  ReactDOM.createRoot(mapContainer).render(<Map />);
}

export default Map;