import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import LegendControl from 'mapboxgl-legend';

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

    map.on('load', () => {
      // Source for state polygons, can be replaced with a different source.
      map.addSource('states', {
          'type': 'geojson',
          'data': 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_admin_1_states_provinces_shp.geojson'
      });

      map.addLayer({
          'id': 'states-layer',
          'type': 'fill',
          'source': 'states',
          'paint': {
              'fill-color': 'rgba(249, 214, 91)',
              'fill-outline-color': 'rgb(0, 0, 0)'
          }
      });

      map.on('click', 'states-layer', (e) => {
          new maplibregl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(e.features && e.features[0] ? e.features[0].properties.name : 'Could not load data')
              .addTo(map);
      });

      // Adjust the cursor to a pointer when it is over the states layer.
      map.on('mouseenter', 'states-layer', () => {
          map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'states-layer', () => {
          map.getCanvas().style.cursor = '';
      });
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainer} className="w-full h-full" />;
};

const mapContainer = document.getElementById("map-container");

if (mapContainer) {
  ReactDOM.createRoot(mapContainer).render(<Map />);
}

export default Map;
