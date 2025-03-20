import * as turf from '@turf/turf';
import { FeatureCollection } from 'geojson';
import maplibregl from 'maplibre-gl';

const LABEL_LAYER_ID = 'dynamic-labels-layer';

interface LabelData {
  name: string;
  coordinates: [number, number];
}

export function addLabels(map: maplibregl.Map, geojsonData: FeatureCollection) {
  const labels: LabelData[] = geojsonData.features
    .map(feature => {
      if (!feature.geometry) {return null;}

      const stateName = feature.properties?.ste_name;
      const centroid = turf.centerOfMass(feature).geometry.coordinates as [
        number,
        number,
      ];

      if (!stateName || !centroid) {return null;}

      if (stateName[0] === 'Alaska') {
        centroid[0] += 1;
        centroid[1] += 1;
      }

      if (stateName[0] === 'Louisiana') {
        centroid[1] -= 0.5;
      }

      if (stateName[0] === 'Florida') {
        centroid[0] += 1;
      }

      if (stateName[0] === 'Michigan') {
        centroid[0] += 1;
        centroid[1] -= 1;
      }

      return {
        name: Array.isArray(stateName) ? stateName[0] : stateName,
        coordinates: centroid,
      };
    })
    .filter(Boolean) as LabelData[];

  const labelGeoJSON: FeatureCollection = {
    type: 'FeatureCollection',
    features: labels.map(label => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: label.coordinates,
      },
      properties: {
        name: label.name,
      },
    })),
  };

  map.addSource(LABEL_LAYER_ID, {
    type: 'geojson',
    data: labelGeoJSON,
  });

  map.addLayer({
    id: LABEL_LAYER_ID,
    type: 'symbol',
    source: LABEL_LAYER_ID,
    layout: {
      'text-field': ['get', 'name'],
      'text-size': 10,
      'text-anchor': 'center',
    },
    paint: {
      'text-color': '#000000',
    },
  });
}
