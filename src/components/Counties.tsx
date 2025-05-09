import * as turf from '@turf/turf';
import maplibregl from 'maplibre-gl';
import countyData from '../data/geojson/counties-albers.json';

const COUNTY_LABEL_ID = 'county-labels-layer';

function loadCounties(
  map: maplibregl.Map,
  onCountySelect?: (feature: maplibregl.MapGeoJSONFeature) => void,
) {
  // Process county names to handle array format
  (countyData as GeoJSON.FeatureCollection).features.forEach(feature => {
    if (feature.properties) {
      const name = feature.properties.coty_name;
      const state = feature.properties.ste_name;
      if (Array.isArray(name)) {
        feature.properties.coty_name = name[0];
      }
      if (Array.isArray(state)) {
        feature.properties.ste_name = state[0];
      }
    }
  });

  // Add counties source
  map.addSource('countiesData', {
    type: 'geojson',
    data: countyData as unknown as GeoJSON.FeatureCollection,
    generateId: true,
  });

  map.addLayer({
    id: 'counties-layer',
    type: 'fill',
    source: 'countiesData',
    minzoom: 6,
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

  // Generate dynamic centroids
  const labels = (countyData as GeoJSON.FeatureCollection).features
    .map(feature => {
      if (!feature.geometry) {
        return null;
      }

      const name = feature.properties?.coty_name;
      const state = feature.properties?.ste_name;
      const center = turf.centerOfMass(feature).geometry.coordinates;

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: center,
        },
        properties: {
          coty_name: Array.isArray(name) ? name[0] : name,
          ste_name: Array.isArray(state) ? state[0] : state,
        },
      };
    })
    .filter(Boolean);

  const labelGeoJSON: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: labels as GeoJSON.Feature[],
  };

  // Add county labels source and layer
  if (!map.getSource(COUNTY_LABEL_ID)) {
    map.addSource(COUNTY_LABEL_ID, {
      type: 'geojson',
      data: labelGeoJSON,
    });
  }

  if (!map.getLayer(COUNTY_LABEL_ID)) {
    map.addLayer({
      id: COUNTY_LABEL_ID,
      type: 'symbol',
      source: COUNTY_LABEL_ID,
      minzoom: 6,
      layout: {
        'text-field': ['get', 'coty_name'],
        'text-size': 9,
        'text-anchor': 'center',
      },
      paint: {
        'text-color': '#000000',
      },
    });
  }

  let hoveredCountyId: string | number | null = null;

  // Change cursor on hover
  map.on('mouseenter', 'counties-layer', () => {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mousemove', 'counties-layer', e => {
    if (e.features && e.features.length > 0) {
      if (hoveredCountyId !== null) {
        map.setFeatureState(
          { source: 'countiesData', id: hoveredCountyId },
          { hover: false },
        );
      }

      hoveredCountyId = e.features[0].id ?? null;
      map.setFeatureState(
        { source: 'countiesData', id: hoveredCountyId },
        { hover: true },
      );
    }
  });

  map.on('mouseleave', 'counties-layer', () => {
    map.getCanvas().style.cursor = '';
    if (hoveredCountyId !== null) {
      map.setFeatureState(
        {
          source: 'countiesData',
          id: hoveredCountyId,
        },
        { hover: false },
      );
    }
    hoveredCountyId = null;
  });

  // On click, call the passed callback to select a county
  map.on('click', 'counties-layer', e => {
    if (e.features && e.features.length > 0 && onCountySelect) {
      const feature = e.features[0];
      onCountySelect(feature);
      setTimeout(() => {
        zoomToCounty(map, feature);
      }, 10);
    }
  });
}

// Zoom to the selected county, using the county border as the bounding box
function zoomToCounty(
  map: maplibregl.Map,
  feature: maplibregl.MapGeoJSONFeature,
) {
  const centroid = turf.centerOfMass(feature).geometry.coordinates;

  map.flyTo({
    center: centroid as [number, number],
    zoom: 8,
    essential: true,
  });
}

export { loadCounties, zoomToCounty };
