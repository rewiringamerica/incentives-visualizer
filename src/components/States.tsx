import maplibregl from 'maplibre-gl';
import { STATE_ABBREVIATION_TO_NAME } from '../data/abbrevsToFull';
import geojsonData from '../data/geojson/states-albers.json';
import { BETA_STATES, LAUNCHED_STATES, STATES_PLUS_DC } from '../data/states';
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
  geojsonData.features.forEach(feature => {
    const name = feature.properties?.ste_name;
    if (Array.isArray(name)) {
      feature.properties.ste_name = name[0];
    }
  });

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

  // Color options: #fcf6e1, #F9D65B, #71c4cb, #6e33cf

  // Add a states layer; adjust the filter as needed for state boundaries
  map.addLayer({
    id: 'states-layer',
    type: 'fill',
    source: 'statesData',
    maxzoom: 6,
    paint: {
      'fill-color': '#FCF6E1',
      'fill-outline-color': '#1E1E1E',
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        1,
        0.75,
      ],
    },
  });

  // Add a layer for the covered states
  const coverageStatesAbb = STATES_PLUS_DC.filter(state =>
    LAUNCHED_STATES.includes(state),
  );

  // Convert state abbrevs to full state name
  const coverageStates = coverageStatesAbb.map(
    stateAbb => STATE_ABBREVIATION_TO_NAME[stateAbb],
  );

  // Add layer for states with coverage
  map.addLayer({
    id: 'states-coverage-layer',
    type: 'fill',
    source: 'statesData',
    maxzoom: 6,
    filter: [
      'all',
      ['in', 'ste_name', ...coverageStates],
    ],
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

  // Find states that have no coverage
  const noCoverageStatesAbb = STATES_PLUS_DC.filter(
    state => !LAUNCHED_STATES.includes(state) && !BETA_STATES.includes(state),
  );

  // Convert state abbrevs to full state name
  const noCoverageStates = noCoverageStatesAbb.map(
    stateAbb => STATE_ABBREVIATION_TO_NAME[stateAbb],
  );

  // Add layer for states with no coverage
  map.addLayer({
    id: 'states-no-coverage-layer',
    type: 'fill',
    source: 'statesData',
    maxzoom: 6,
    filter: [
      'all',
      ['in', 'ste_name', ...noCoverageStates],
    ],
    paint: {
      'fill-color': '#6E33CF',
      'fill-outline-color': '#1E1E1E',
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        1,
        0.5,
      ],
    },
  });

  // convert beta states to full names
  const betaStates = BETA_STATES.map(
    stateAbb => STATE_ABBREVIATION_TO_NAME[stateAbb],
  );

  // Add layer for states with beta coverage
  map.addLayer({
    id: 'states-beta-layer',
    type: 'fill',
    source: 'statesData',
    maxzoom: 6,
    filter: [
      'all',
      ['in', 'ste_name', ...betaStates],
    ],
    paint: {
      'fill-color': '#71C4CB',
      'fill-outline-color': '#1E1E1E',
      'fill-opacity': [
        'case',
        ['boolean', ['feature-state', 'hover'], false],
        1,
        0.5,
      ],
    },
  });

  // Add labels for states
  addLabels(map, geojsonData);

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

      const steName = e.features[0].properties.ste_name;

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
      const feature = e.features[0];
      const stateName = feature.properties.ste_name;

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

export { loadStates, zoomToState };
