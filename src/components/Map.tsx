import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import LegendControl from "mapboxgl-legend";

const Map: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://demotiles.maplibre.org/style.json", // Demo tiles, use MapTiler later
      center: [-98.5795, 39.8283], // USA-center
      zoom: 4,
    });

    const legend = new LegendControl({
      layers: ["countries-fill"],
    });
    map.addControl(legend, "bottom-left");

    return () => map.remove();
  }, []);


  return <div ref={mapContainer} className="w-full h-full" />;
};

const mapContainer = document.getElementById("map-container");
if (mapContainer) {
  ReactDOM.createRoot(mapContainer).render(<Map />);
}

export default Map;
