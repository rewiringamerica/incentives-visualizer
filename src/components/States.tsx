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

    // Example custom data to be joined with geojson data
    var statesInfo = {
        "NJ": {"name":"New Jersey","population":8882190},
    };

    // Example of how to join custom data with geojson data
    function setStates(e) {
        var states = map.querySourceFeatures('statesData', {
            sourceLayer: 'administrative',
            filter: ['all', ['==', 'level', 1], ['==', 'iso_a2', 'US']],
        });
        
        // Adds custom data to the geojson state data
        states.forEach(function(row) {
            const stateCode: string = row.properties.code;
            const splitStateCode: string[] = stateCode.split('-');
            const stateId: string = splitStateCode[1];

            if(row.id && statesInfo[stateId]) {
            map.setFeatureState({
                source: 'statesData',
                sourceLayer: 'administrative',
                id: row.id
            }, {
                population: statesInfo[stateId].population
            });
            }
        });
    }

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