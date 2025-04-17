import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import React, { useEffect, useRef, useState } from 'react';
import '../styles/index.css';
import { loadCounties } from './Counties';
import Legend from './Legend';
import MapHighlights from './MapHighlights';
import { loadStates, zoomToState } from './States';
import ZoomControls from './ZoomControls';

interface MapProps {
  onStateSelect: (feature: maplibregl.MapGeoJSONFeature | null) => void;
  onCountySelect: (feature: maplibregl.MapGeoJSONFeature | null) => void;
  mapInstance: maplibregl.Map | null;
  onMapSet: React.Dispatch<React.SetStateAction<maplibregl.Map | null>>;
  selectedState: maplibregl.MapGeoJSONFeature | null;
  selectedCounty: maplibregl.MapGeoJSONFeature | null;
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
  const STYLE_VERSION = 8; // Required for declaring a style, may change in the future
  const [currentZoom, setCurrentZoom] = useState(4.2);

  useEffect(() => {
    if (!mapContainer.current) {
      return;
    }
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: STYLE_VERSION,
        sources: {},
        layers: [],
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf',
      },
      center: [0, 0],
      zoom: 4.2,
      maxBounds: [
        [-30, -15], // Southwest corner, Mainland USA
        [30, 15], // Northeast corner, Mainland USA
      ],
      interactive: true,
      dragPan: true,
      dragRotate: false,
      scrollZoom: false,
      doubleClickZoom: false,
      touchZoomRotate: false,
      boxZoom: false,
    });

    map.on('load', () => {
      // Load states and pass the onStateSelect callback so a state click will notify the parent.
      loadCounties(map, onCountySelect, selectedState || selectedCounty);
      loadStates(map, onStateSelect, selectedState || selectedCounty);
      onMapSet(map);
    });

    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    return () => map.remove();
  }, [onStateSelect, onCountySelect, onMapSet]);

  const handleZoomOut = () => {
    if (!mapInstance) {return;}

    let targetZoom = 4.2; // Default to national view
    if (currentZoom >= 8) {
      targetZoom = 6; // County -> State

      if (selectedCounty) {
        const stateName = selectedCounty.properties?.ste_name;
        if (stateName) {
          const statesSource = mapInstance.getSource('statesData');
          if (statesSource && statesSource.type === 'geojson') {
            const statesData = statesSource.serialize().data;
            const stateFeature = statesData.features.find(
              (feature: maplibregl.MapGeoJSONFeature) =>
                feature.properties?.ste_name === stateName,
            );
            if (stateFeature) {
              onStateSelect(stateFeature);
              setTimeout(() => {
                zoomToState(mapInstance, stateFeature);
              }, 10);
              return;
            }
          }
        }
      }
    } else if (currentZoom >= 6) {
      targetZoom = 4.2;
      onStateSelect(null);
      onCountySelect(null);
    }

    setTimeout(() => {
      mapInstance.flyTo({
        ...(targetZoom === 4.2 ? { center: [0, 0] } : {}),
        zoom: targetZoom,
        essential: true,
      });
    }, 10);
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      <ZoomControls onZoomOut={handleZoomOut} />
      <Legend map={mapInstance} />
      <MapHighlights
        map={mapInstance}
        selectedState={selectedState}
        selectedCounty={selectedCounty}
      />
    </div>
  );
};

export default Map;
