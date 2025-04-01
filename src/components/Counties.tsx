import * as turf from '@turf/turf';
import maplibregl from 'maplibre-gl';
import countyData from '../data/geojson/counties-albers.json';

const COUNTY_LABEL_ID = 'county-labels-layer';

export interface CountyData {
  name: string;
  description: string;
}

export function loadCounties(
  map: maplibregl.Map,
  onCountySelect?: (data: CountyData) => void,
) {
  // Process county names to handle array format
  (countyData as GeoJSON.FeatureCollection).features.forEach(feature => {
    if (feature.properties) {
      const name = feature.properties.coty_name;
      if (Array.isArray(name)) {
        feature.properties.coty_name = name[0];
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
      const center = turf.centerOfMass(feature).geometry.coordinates;

      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: center,
        },
        properties: {
          name: Array.isArray(name) ? name[0] : name,
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
        'text-field': ['get', 'name'],
        'text-size': 9,
        'text-anchor': 'center',
      },
      paint: {
        'text-color': '#000000',
      },
    });
  }

  let hoveredCountyId: string | number | null = null;
  const tooltip = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

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

      const cotyName = e.features[0].properties?.coty_name;

      tooltip.setLngLat(e.lngLat).setHTML(cotyName).addTo(map);
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
    tooltip.remove();
    hoveredCountyId = null;
  });

  // On click, call the passed callback to select a county
  map.on('click', 'counties-layer', e => {
    if (e.features && e.features.length > 0 && onCountySelect) {
      const feature = e.features[0];
      const countyName = feature.properties?.coty_name;

      const countyData: CountyData = {
        name: countyName || 'Unknown County',
        description: `Details about ${countyName || 'Unknown County'}...`,
      };
      onCountySelect(countyData);
      zoomToCounty(map, feature);
    }
  });
}

// Zoom to the selected county, using the county border as the bounding box
function zoomToCounty(
  map: maplibregl.Map,
  feature: maplibregl.MapGeoJSONFeature,
) {
  const bounds = [Infinity, Infinity, -Infinity, -Infinity];

  function processCoordinates(coords: number[]) {
    if (Array.isArray(coords[0])) {
      coords.forEach(c => processCoordinates(c as unknown as number[]));
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
    processCoordinates(feature.geometry.coordinates as number[]);
  }

  map.fitBounds(bounds as [number, number, number, number], {
    padding: 40,
    maxZoom: 10,
    duration: 1000,
  });
}
