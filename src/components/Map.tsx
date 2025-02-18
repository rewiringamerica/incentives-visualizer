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
    const API_KEY = process.env.MAPTILER_API_KEY
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`, // Demo tiles, use MapTiler later
      center: [-98.5795, 39.8283], // USA-center
      zoom: 4,
    });

    let hoveredStateId = null;
    const tooltip = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('load', () => {
      map.addSource('statesData', {
        type: 'vector',
        url: `https://api.maptiler.com/tiles/countries/tiles.json?key=${API_KEY}`
      });

      map.addLayer({
        id: 'states-layer',
        type: 'fill',
        source: 'statesData',
        'source-layer': 'administrative',
        filter: ['all', ['==', 'level', 1], ['==', 'iso_a2', 'US']],
        paint: {
          'fill-color': '#F9D65B',
          'fill-outline-color': '#1E1E1E',
          'fill-opacity': ['case',
            ['boolean', ['feature-state', 'hover'], false], 1, 0.5]
        }
      });

      var statesInfo = {
        "NJ": {"name":"New Jersey","population":8882190},
      };

      function setStates(e) {
        var states = map.querySourceFeatures('statesData', {
          sourceLayer: 'administrative',
          filter: ['all', ['==', 'level', 1], ['==', 'iso_a2', 'US']],
        });
      
        // Adds custom data to the geojson state data
        states.forEach(function(row) {
          const stateCode: string = row.properties.code;
          const splitStateCode: string[] = stateCode.split('-');
          const stateId: string = splitStateCode[1];

          if(row.id && statesInfo[stateId]) {
            map.setFeatureState({
              source: 'statesData',
              sourceLayer: 'administrative',
              id: row.id
            }, {
              population: statesInfo[stateId].population
            });
          }
        });
      }


      // Mouse controls
      map.on('mouseenter', 'states-layer', () => {
          map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mousemove', 'states-layer', (e) => {
        if (e.features && e.features.length > 0) {
            if (hoveredStateId) {
                map.setFeatureState(
                  {source: 'statesData', sourceLayer: 'administrative', 
                    id: hoveredStateId},
                  {hover: false}
                );
                tooltip
                    .setLngLat(e.lngLat)
                    .setHTML(e.features[0].properties.name)
                    .addTo(map);
            }
            hoveredStateId = e.features[0].id;
            map.setFeatureState(
                {source: 'statesData', sourceLayer: 'administrative',
                  id: hoveredStateId},
                {hover: true}
            );
        }
      });

      map.on('mouseleave', 'states-layer', () => {
          map.getCanvas().style.cursor = '';
          if (hoveredStateId) {
              map.setFeatureState(
                  {source: 'statesData', sourceLayer: 'administrative',
                    id: hoveredStateId},
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
