import maplibregl from 'maplibre-gl';
import { useEffect } from 'react';

interface MapHighlightsProps {
  map: maplibregl.Map | null;
  selectedState: maplibregl.MapGeoJSONFeature | null;
  selectedCounty: maplibregl.MapGeoJSONFeature | null;
}

const MapHighlights: React.FC<MapHighlightsProps> = ({
  map,
  selectedState,
  selectedCounty,
}) => {
  useEffect(() => {
    if (!map) {
      return;
    }

    if (map.getLayer('selected-state-highlight')) {
      map.removeLayer('selected-state-highlight');
    }
    if (map.getLayer('selected-county-highlight')) {
      map.removeLayer('selected-county-highlight');
    }

    // Add state highlight if a state is selected
    if (selectedState) {
      map.addLayer({
        id: 'selected-state-highlight',
        type: 'line',
        source: 'statesData',
        filter: ['==', 'ste_name', selectedState.properties?.ste_name],
        paint: {
          'line-color': '#3d0db4',
          'line-width': 3,
          'line-opacity': 1,
        },
      });
    }

    // Add county highlight if a county is selected
    if (selectedCounty) {
      map.addLayer({
        id: 'selected-county-highlight',
        type: 'line',
        source: 'countiesData',
        filter: [
          'all',
          ['==', 'coty_name', selectedCounty.properties?.coty_name],
          ['==', 'ste_name', selectedCounty.properties?.ste_name],
        ],
        paint: {
          'line-color': '#3d0db4',
          'line-width': 3,
          'line-opacity': 1,
        },
      });
    }

    return () => {
      if (map.getLayer('selected-state-highlight')) {
        map.removeLayer('selected-state-highlight');
      }
      if (map.getLayer('selected-county-highlight')) {
        map.removeLayer('selected-county-highlight');
      }
    };
  }, [map, selectedState, selectedCounty]);

  return null;
};

export default MapHighlights;
