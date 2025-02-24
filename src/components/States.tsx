import maplibregl from "maplibre-gl";

export interface StateData {
  name: string;
  description: string;
}

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
    type: 'vector',
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
          { source: "statesData", sourceLayer: "administrative", id: hoveredStateId },
          { hover: false }
        );
      }
      hoveredStateId = e.features[0].id;
      map.setFeatureState(
        { source: "statesData", sourceLayer: "administrative", id: hoveredStateId },
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
        { source: "statesData", sourceLayer: "administrative", id: hoveredStateId },
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
    }
  });
}

export default loadStates;