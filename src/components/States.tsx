import * as turf from '@turf/turf';
import maplibregl from 'maplibre-gl';
import { STATE_ABBREVIATION_TO_NAME } from '../data/abbrevsToFull';
import geojsonData from '../data/geojson/states-albers.json';
import { BETA_STATES, LAUNCHED_STATES, STATES_PLUS_DC } from '../data/states';
import { addLabels } from './MapLabels';

function loadStates(
  map: maplibregl.Map,
  onStateSelect?: (feature: maplibregl.MapGeoJSONFeature) => void,
) {
  (geojsonData as GeoJSON.FeatureCollection).features.forEach(feature => {
    if (feature.properties) {
      const name = feature.properties.ste_name;
      if (Array.isArray(name)) {
        feature.properties.ste_name = name[0];
      }
    }
  });

  let hoveredStateId: string | number | null = null;

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

  // Set hover state
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
    }
  });

  // Remove hover state when leaving
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
    hoveredStateId = null;
  });

  // On click, call the passed callback to select a state
  map.on('click', 'states-layer', e => {
    if (e.features && e.features.length > 0 && onStateSelect) {
      const feature = e.features[0];
      onStateSelect(feature);
      setTimeout(() => {
        zoomToState(map, feature);
      }, 10);
    }
  });
}

// Zoom to the selected state, using the state border as the bounding box
function zoomToState(
  map: maplibregl.Map,
  feature: maplibregl.MapGeoJSONFeature,
) {
  const centroid = turf.centerOfMass(feature).geometry.coordinates;

  map.flyTo({
    center: centroid as [number, number],
    zoom: 6,
    essential: true,
  });
}

export { loadStates, zoomToState };
