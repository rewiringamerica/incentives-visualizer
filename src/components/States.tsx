import maplibregl from "maplibre-gl";
import { US_STATE_NAMES } from "../data/states";

export interface StateData {
  name: string;
  description: string;
}

let isStateSelected = false;

function loadStates(
  map: maplibregl.Map,
  onStateSelect?: (data: StateData) => void
) {
  const API_KEY = process.env.MAPTILER_API_KEY;
  let hoveredStateId: string | number | null = null;
  const tooltip = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false,
  });

  map.addSource("statesData", {
    type: "vector",
    url: `https://api.maptiler.com/tiles/countries/tiles.json?key=${API_KEY}`,
  });

  // Add a states layer; adjust the filter as needed for state boundaries
  map.addLayer({
    id: "states-layer",
    type: "fill",
    source: "statesData",
    "source-layer": "administrative",
    filter: ["all", ["==", "level", 1], ["==", "iso_a2", "US"]],
    paint: {
      "fill-color": "#F9D65B",
      "fill-outline-color": "#1E1E1E",
      "fill-opacity": [
        "case",
        ["boolean", ["feature-state", "hover"], false],
        1,
        0.5,
      ],
    },
  });

  const labelLayout = {
    "text-field": "{name:en}",
    "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
    "text-size": 12,
    "text-offset": [0, 0],
    "symbol-placement": "point",
  };

  const labelPaint = {
    "text-color": "#000000",
  };

  map.addLayer({
    id: "state-labels-layer",
    type: "symbol",
    source: {
      type: "vector",
      url: `https://api.maptiler.com/tiles/v3-openmaptiles/tiles.json?key=${API_KEY}`,
    },
    "source-layer": "place",
    filter: [
      "all",
      ["in", "class", "state", "island"],
      ["in", "name:en", ...US_STATE_NAMES],
    ],
    layout: labelLayout,
    paint: labelPaint,
  });

  // Used for Hawaii and DC
  map.addSource("statesLabelData", {
    type: "vector",
    url: `https://api.maptiler.com/tiles/v3/tiles.json?key=${API_KEY}`,
  });

  // Add layer for Hawaii label (doesn't show up in the state-labels-layer)
  map.addLayer({
    id: "hawaii-label",
    type: "symbol",
    source: "statesLabelData",
    "source-layer": "place",
    filter: ["all", ["==", "class", "state"], ["==", "name:en", "Hawaii"]],
    layout: labelLayout,
    paint: labelPaint,
  });

  map.addLayer({
    id: "dc-label",
    type: "symbol",
    source: "statesLabelData",
    "source-layer": "place",
    filter: [
      "all",
      ["==", "class", "state"],
      ["==", "name:en", "Washington, D.C."],
    ],
    layout: labelLayout,
    paint: labelPaint,
  });

  // Change cursor on enter
  map.on("mouseenter", "states-layer", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  // Set hover state and show tooltip
  map.on("mousemove", "states-layer", (e) => {
    if (e.features && e.features.length > 0) {
      // Reset previous hovered feature
      if (hoveredStateId !== null) {
        map.setFeatureState(
          {
            source: "statesData",
            sourceLayer: "administrative",
            id: hoveredStateId,
          },
          { hover: false }
        );
      }
      hoveredStateId = e.features[0].id;
      map.setFeatureState(
        {
          source: "statesData",
          sourceLayer: "administrative",
          id: hoveredStateId,
        },
        { hover: true }
      );
      tooltip
        .setLngLat(e.lngLat)
        .setHTML(e.features[0].properties.name)
        .addTo(map);
    }
  });

  // Remove hover state and tooltip when leaving
  map.on("mouseleave", "states-layer", () => {
    map.getCanvas().style.cursor = "";
    if (hoveredStateId !== null) {
      map.setFeatureState(
        {
          source: "statesData",
          sourceLayer: "administrative",
          id: hoveredStateId,
        },
        { hover: false }
      );
    }
    tooltip.remove();
    hoveredStateId = null;
  });

  // On click, call the passed callback to select a state
  map.on("click", "states-layer", (e) => {
    if (e.features && e.features.length > 0 && onStateSelect) {
      const feature = e.features[0];
      const stateName = feature.properties.name;
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
  feature: maplibregl.MapGeoJSONFeature
) {
  const bounds = [Infinity, Infinity, -Infinity, -Infinity];

  function processCoordinates(coords) {
    if (Array.isArray(coords[0])) {
      coords.map((c) => processCoordinates(c));
    } else {
      bounds[0] = Math.min(bounds[0], coords[0]);
      bounds[1] = Math.min(bounds[1], coords[1]);
      bounds[2] = Math.max(bounds[2], coords[0]);
      bounds[3] = Math.max(bounds[3], coords[1]);
    }
  }

  if (feature.geometry && feature.geometry.coordinates) {
    processCoordinates(feature.geometry.coordinates);
  }

  map.fitBounds(bounds, {
    padding: 40,
    maxZoom: 6,
    duration: 1000,
  });
}

function resetStateSelection() {
  isStateSelected = false;
}

export { loadStates, resetStateSelection };
