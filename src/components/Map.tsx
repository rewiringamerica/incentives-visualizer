import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import LegendControl from 'mapboxgl-legend';
import '../styles/index.css';

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

    let hoveredStateId = null;
    const tooltip = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('load', () => {
      // Source for state polygons, can be replaced with a different source.
      map.addSource('states', {
          'type': 'geojson',
          'data': 'https://maplibre.org/maplibre-gl-js/docs/assets/us_states.geojson'
      });

      map.addLayer({
          'id': 'states-layer',
          'type': 'fill',
          'source': 'states',
          'paint': {
              'fill-color': '#F9D65B',
              'fill-outline-color': '#1E1E1E',
              'fill-opacity': [
                  'case',
                  ['boolean', ['feature-state', 'hover'], false],
                  1,
                  0.5
              ]
          }
      });

      // Mouse controls
      map.on('mouseenter', 'states-layer', () => {
          map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mousemove', 'states-layer', (e) => {
        if (e.features && e.features.length > 0) {
            if (hoveredStateId) {
                map.setFeatureState(
                  {source: 'states', id: hoveredStateId},
                  {hover: false}
                );
                tooltip
                    .setLngLat(e.lngLat)
                    .setHTML(e.features[0].properties.STATE_NAME)
                    .addTo(map);
            }
            hoveredStateId = e.features[0].id;
            map.setFeatureState(
                {source: 'states', id: hoveredStateId},
                {hover: true}
            );
        }
      });

      map.on('mouseleave', 'states-layer', () => {
          map.getCanvas().style.cursor = '';
          if (hoveredStateId) {
              map.setFeatureState(
                  {source: 'states', id: hoveredStateId},
                  {hover: false}
              );
              tooltip.remove();
          }
          hoveredStateId = null;
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
