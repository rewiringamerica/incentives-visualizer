import maplibregl from "maplibre-gl";

function loadStates(map: maplibregl.Map) {
    const API_KEY = process.env.MAPTILER_API_KEY

    let hoveredStateId: string | number | null = null;
    const tooltip = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.addSource('statesData', {
        type: 'vector',
        url: `https://api.maptiler.com/tiles/countries/tiles.json?key=${API_KEY}`
    });

    map.addLayer({
        id: 'states-layer',
        type: 'fill',
        source: 'statesData',
        'source-layer': 'administrative',
        filter: ['all', ['==', 'level', 1], ['==', 'iso_a2', 'US']],
        paint: {
            'fill-color': '#F9D65B',
            'fill-outline-color': '#1E1E1E',
            'fill-opacity': ['case',
            ['boolean', ['feature-state', 'hover'], false], 1, 0.5]
        }
    });

    // Mouse controls
    map.on('mouseenter', 'states-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mousemove', 'states-layer', (e) => {
        // Changes hovered state; a hovered state shows a tooltip of state name 
        if (e.features && e.features.length > 0) {
            if (hoveredStateId) {
                map.setFeatureState(
                    {source: 'statesData', sourceLayer: 'administrative', id: hoveredStateId},
                    {hover: false}
                );
                tooltip
                    .setLngLat(e.lngLat)
                    .setHTML(e.features[0].properties.name)
                    .addTo(map);
            }
            if (e.features[0] && e.features[0].id) {
                hoveredStateId = e.features[0].id;
                map.setFeatureState(
                    {source: 'statesData', sourceLayer: 'administrative',
                        id: hoveredStateId},
                    {hover: true}
                );
            }
        }
    });

    map.on('mouseleave', 'states-layer', () => {
        map.getCanvas().style.cursor = '';
        if (hoveredStateId) {
            map.setFeatureState(
                {source: 'statesData', sourceLayer: 'administrative', id: hoveredStateId},
                {hover: false}
            );
            tooltip.remove();
        }
        hoveredStateId = null;
    });
}

export default loadStates;