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
  queryClient: QueryClient,
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
    filter: [
      'all',
      ['in', ['get', 'ste_name'], ['literal', coverageStates]],
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
    //maxzoom: 6,
    filter: [
      'all',
      ['in', ['get', 'ste_name'], ['literal', betaStates]],
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

  // put low incentives in this array
  const incentivesLow: string[] = [];
  // put med incentives in this array
  const incentivesMed: string[] = [];
  // put hi incentives in this array
  const incentivesHi: string[] = [];

  // for each state geo feature ste_name
  (async () => {
    for (const feature of geojsonData.features) {
      const stateName = feature.properties?.ste_name;
      const stateAbbr = stateName
        ? STATE_NAME_TO_ABBREVIATION[stateName]
        : null;

      if (!stateAbbr) {
        continue;
      }

      try {
        const incentives = await queryClient.fetchQuery(
          $api.queryOptions('get', '/api/v1/incentives', {
            params: {
              query: {
                state:
                  STATE_NAME_TO_ABBREVIATION[feature?.properties?.ste_name],
              },
            },
          }),
        );

        if (!incentives) {
          console.error(`No data for ${stateName}`);
          continue;
        }

        const count = incentives.incentives?.length || 0;

        if (count <= 20) {
          incentivesLow.push(stateName);
        } else if (count <= 60) {
          incentivesMed.push(stateName);
        } else if (count > 60) {
          incentivesHi.push(stateName);
        }
      } catch (err) {
        console.error(`Error fetching for ${stateAbbr}:`, err);
      }
    }

    // Add layer for states with 1-10 incentives
    map.addLayer({
      id: 'states-incentives-low-layer',
      type: 'fill',
      source: 'statesData',
      filter: [
        'all',
        ['in', 'ste_name', ...incentivesLow],
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
      layout: {
        visibility: 'visible',
      },
    });

    // Add layer for states with 11-20 incentives
    map.addLayer({
      id: 'states-incentives-med-layer',
      type: 'fill',
      source: 'statesData',
      filter: [
        'all',
        ['in', 'ste_name', ...incentivesMed],
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
        visibility: 'visible',
      },
    });

    // Add layer for states with 11-20 incentives
    map.addLayer({
      id: 'states-incentives-hi-layer',
      type: 'fill',
      source: 'statesData',
      filter: [
        'all',
        ['in', 'ste_name', ...incentivesHi],
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
        visibility: 'visible',
      },
    });

    // move incentives layers to the bottom
    map.moveLayer('states-incentives-low-layer', 'states-coverage-layer');
    map.moveLayer('states-incentives-med-layer', 'states-coverage-layer');
    map.moveLayer('states-incentives-hi-layer', 'states-coverage-layer');

    // move county labels on top
    map.moveLayer('counties-layer');
    map.moveLayer('county-labels-layer');
  })();

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
  const coverageLayerIds = [
    'states-coverage-layer',
    'states-beta-layer',
  ];

  const incentivesLayerIds = [
    'states-incentives-low-layer',
    'states-incentives-med-layer',
    'states-incentives-hi-layer',
  ];

  const coverageVisibility = visible ? 'visible' : 'none';
  const incentivesVisibility = visible ? 'none' : 'visible';

  coverageLayerIds.forEach(id => {
    if (!map.getLayer(id)) {
      return;
    }
    map.setLayoutProperty(id, 'visibility', coverageVisibility);
  });

  incentivesLayerIds.forEach(id => {
    if (!map.getLayer(id)) {
      return;
    }
    map.setLayoutProperty(id, 'visibility', incentivesVisibility);
  });
}

function resetStateSelection() {
  isStateSelected = false;
}

export { loadStates, resetStateSelection, updateStatesVisibility, zoomToState };
