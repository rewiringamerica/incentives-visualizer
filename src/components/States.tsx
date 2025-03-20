import maplibregl from 'maplibre-gl';
import geojsonData from '../data/geojson/states-albers.json';
import { addLabels } from './MapLabels';

export interface StateData {
  name: string;
  description: string;
}

let isStateSelected = false;

function loadStates(
  map: maplibregl.Map,
  onStateSelect?: (data: StateData) => void,
) {
  let hoveredStateId: string | number | null = null;
  const tooltip = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  map.addSource('statesData', {
    type: 'geojson',
    data: geojsonData as unknown as GeoJSON.FeatureCollection,
    generateId: true,
  });

  // Add a states layer; adjust the filter as needed for state boundaries
  map.addLayer({
    id: 'states-layer',
    type: 'fill',
    source: 'statesData',
    paint: {
      'fill-color': '#F9D65B',
      'fill-outline-color': '#1E1E1E',
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        1,
        0.5,
      ],
    },
  });

  addLabels(map, geojsonData as unknown as GeoJSON.FeatureCollection);

  // Change cursor on enter
  map.on('mouseenter', 'states-layer', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  // Set hover state and show tooltip
  map.on('mousemove', 'states-layer', e => {
    if (e.features && e.features.length > 0) {
      if (hoveredStateId !== null) {
        map.setFeatureState(
          { source: 'statesData', id: hoveredStateId },
          { hover: false },
        );
      }
      hoveredStateId = e.features[0].id ?? null;
      map.setFeatureState(
        { source: 'statesData', id: hoveredStateId },
        { hover: true },
      );

      // Parse ste_name from ["Name"] to Name
      const steNameRaw = e.features[0].properties.ste_name;
      let steName = steNameRaw;
      try {
        const parsed = JSON.parse(steNameRaw);
        if (Array.isArray(parsed)) {
          steName = parsed[0];
        }
      } catch (error) {
        console.error('Error parsing ste_name:', error);
      }

      tooltip.setLngLat(e.lngLat).setHTML(steName).addTo(map);
    }
  });

  // Remove hover state and tooltip when leaving
  map.on('mouseleave', 'states-layer', () => {
    map.getCanvas().style.cursor = '';
    if (hoveredStateId !== null) {
      map.setFeatureState(
        {
          source: 'statesData',
          id: hoveredStateId,
        },
        { hover: false },
      );
    }
    tooltip.remove();
    hoveredStateId = null;
  });

  // On click, call the passed callback to select a state
  map.on('click', 'states-layer', e => {
    if (e.features && e.features.length > 0 && onStateSelect) {
      console.log('State Name:', e.features[0].properties.name);

      const feature = e.features[0];
      const stateNameRaw = feature.properties.ste_name;
      let stateName = stateNameRaw;
      try {
        const parsed = JSON.parse(stateNameRaw);
        if (Array.isArray(parsed)) {
          stateName = parsed[0];
        }
      } catch (error) {
        console.error('Error parsing ste_name:', error);
      }

      const stateData: StateData = {
        name: stateName,
        description: `Details about ${stateName}...`,
      };
      onStateSelect(stateData);
      if (!isStateSelected) {
        zoomToState(map, feature);
        isStateSelected = true;
      }
    }
  });
}

// Zoom to the selected state, using the state border as the bounding box
function zoomToState(
  map: maplibregl.Map,
  feature: maplibregl.MapGeoJSONFeature,
) {
  const bounds = [Infinity, Infinity, -Infinity, -Infinity];

  function processCoordinates(coords) {
    if (Array.isArray(coords[0])) {
      coords.map(c => processCoordinates(c));
    } else {
      bounds[0] = Math.min(bounds[0], coords[0]);
      bounds[1] = Math.min(bounds[1], coords[1]);
      bounds[2] = Math.max(bounds[2], coords[0]);
      bounds[3] = Math.max(bounds[3], coords[1]);
    }
  }

  if (
    feature.geometry &&
    feature.geometry.type !== 'GeometryCollection' &&
    'coordinates' in feature.geometry
  ) {
    processCoordinates(feature.geometry.coordinates);
  }

  map.fitBounds(bounds as [number, number, number, number], {
    padding: 40,
    maxZoom: 6,
    duration: 1000,
  });
}

function resetStateSelection() {
  isStateSelected = false;
}

export { loadStates, resetStateSelection };
