import * as turf from '@turf/turf';
import maplibregl from 'maplibre-gl';
import {
  STATE_ABBREVIATION_TO_NAME,
  STATE_NAME_TO_ABBREVIATION,
} from '../data/abbrevsToFull';
import geojsonData from '../data/geojson/states-albers.json';
import { BETA_STATES, LAUNCHED_STATES, STATES_PLUS_DC } from '../data/states';
import { $api } from '../lib/api';
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

  // Add a layer for all states
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

  // Adding layers for the coverage

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
    layout: {
      visibility: 'none',
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
    layout: {
      visibility: 'none',
    },
  });

  // Add layers for incentives numbers

  // get states with 1-10 incentives
  // query all states to get their incentive number

  // put incentives with 1-10 in this array
  const incentives1to10 = [];
  // put incentives with 11-20 in this array
  const incentives11to20 = [];
  // put incentives with 20+ in this array
  const incentives20Plus = [];

  // for each state geo feature ste_name
  // try catch
  try {
    for (const feature of geojsonData.features) {
      if (feature.properties?.ste_name) {
        // query for incentives
        const incentives = $api.useQuery('get', '/api/v1/incentives', {
          params: {
            query: {
              state: feature?.properties?.ste_name
                ? STATE_NAME_TO_ABBREVIATION[feature?.properties?.ste_name]
                : undefined,
            },
          },
        });

        // get the number of incentives
        const incentiveCount =
          incentives.data?.incentives[0]?.items.length ?? 0;

        if (incentiveCount > 0) {
          if (incentiveCount <= 10) {
            incentives1to10.push(feature.properties.ste_name);
          } else if (incentiveCount <= 20) {
            incentives11to20.push(feature.properties.ste_name);
          } else {
            incentives20Plus.push(feature.properties.ste_name);
          }
        }
      }
    }
  } catch {
    console.log('Error fetching incentives');
  }

  // Add layer for states with no coverage, always on top
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
      'fill-color': '#8F8F8F',
      'fill-outline-color': '#1E1E1E',
      'fill-opacity': 1,
    },
    layout: {
      visibility: 'visible',
    },
  });

  // TODO: Add layers for incentive numbers on top.

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
      // check if clicked state is uncovered
      const clickedState = e.features[0].properties.ste_name;
      const isUncovered = noCoverageStates.includes(clickedState);

      // If the clicked state is uncovered, do not select it
      if (isUncovered) {
        return;
      }

      // If the clicked state is covered, select it
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

function updateStatesVisibility(map: maplibregl.Map, visible: boolean) {
  // exclude no coverage, because we don't show
  // TODO: add layers for incentives
  const layerIds = [
    'states-coverage-layer',
    'states-beta-layer',
  ];
  const visibility = visible ? 'visible' : 'none';

  layerIds.forEach(id => {
    if (!map.getLayer(id)) {
      return;
    }
    map.setLayoutProperty(id, 'visibility', visibility);
  });
}

function resetStateSelection() {
  isStateSelected = false;
}

export { loadStates, resetStateSelection, updateStatesVisibility, zoomToState };
