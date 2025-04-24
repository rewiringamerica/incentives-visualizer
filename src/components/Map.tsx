import { useQueryClient } from '@tanstack/react-query';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import React, { useEffect, useRef, useState } from 'react';
import { env } from '../lib/env';
import '../styles/index.css';
import { loadCounties } from './Counties';
import Legend from './Legend';
import MapHighlights from './MapHighlights';
import { loadStates, updateStatesVisibility, zoomToState } from './States';
import Toggle from './Toggle';
import ZoomControls from './ZoomControls';

interface MapProps {
  onStateSelect: (feature: maplibregl.MapGeoJSONFeature | null) => void;
  onCountySelect: (feature: maplibregl.MapGeoJSONFeature | null) => void;
  mapInstance: maplibregl.Map | null;
  onMapSet: React.Dispatch<React.SetStateAction<maplibregl.Map | null>>;
  selectedState: maplibregl.MapGeoJSONFeature | null;
  selectedCounty: maplibregl.MapGeoJSONFeature | null;
  isVisible: boolean;
}

const Map: React.FC<MapProps> = ({
  onStateSelect,
  onCountySelect,
  mapInstance,
  onMapSet,
  selectedState,
  selectedCounty,
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const STYLE_VERSION = 8; // Required for declaring a style, may change in the future
  const [currentZoom, setCurrentZoom] = useState(4.2);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!mapContainer.current) {
      return;
    }

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: STYLE_VERSION,
        sources: {},
        layers: [],
        glyphs: `https://api.maptiler.com/fonts/{fontstack}/{range}.pbf?key=${env.MAPTILER_API_KEY}`,
      },
      center: [0, 0],
      zoom: 4.2,
      maxBounds: [
        [-30, -20], // Southwest corner, Mainland USA
        [30, 20], // Northeast corner, Mainland USA
      ],
      interactive: true,
      dragPan: true,
      dragRotate: false,
      scrollZoom: false,
      doubleClickZoom: false,
      touchZoomRotate: false,
      boxZoom: false,
    });

    map.on('load', () => {
      // Load states and pass the onStateSelect callback so a state click will notify the parent.
      loadCounties(map, onCountySelect);
      loadStates(map, queryClient, onStateSelect);
      onMapSet(map);
    });

    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    return () => map.remove();
  }, [onStateSelect, onCountySelect, onMapSet]);

  const addFilterToSpec = (
    existingFilter: maplibregl.FilterSpecification | void,
    newFilter: maplibregl.FilterSpecification,
  ) => {
    if (!existingFilter) {
      return newFilter;
    }

    if (
      Array.isArray(existingFilter) &&
      existingFilter[0] === 'in' &&
      existingFilter[1] === 'ste_name'
    ) {
      existingFilter = [
        'in',
        ['get', 'ste_name'],
        ...existingFilter.slice(2),
      ] as unknown as maplibregl.FilterSpecification;
    }

    if (Array.isArray(existingFilter) && existingFilter[0] === 'all') {
      const convertedFilters = existingFilter.slice(1).map(f => {
        if (Array.isArray(f) && f[0] === 'in' && f[1] === 'ste_name') {
          return [
            'in',
            ['get', 'ste_name'],
            ...f.slice(2),
          ] as unknown as maplibregl.FilterSpecification;
        }
        return f as maplibregl.FilterSpecification;
      });
      return [
        'all',
        ...convertedFilters,
        newFilter,
      ] as maplibregl.FilterSpecification;
    }

    return ['all', existingFilter, newFilter] as maplibregl.FilterSpecification;
  };

  const removeSelectionFilters = (
    filter: maplibregl.FilterSpecification | void,
  ): maplibregl.FilterSpecification | null => {
    if (!filter) {
      return null;
    }
    const isSelectionFilter = (f: maplibregl.FilterSpecification) => {
      return (
        Array.isArray(f) &&
        f.length === 3 &&
        (f[0] === '==' || f[0] === '!=') &&
        Array.isArray(f[1]) &&
        f[1][0] === 'get' &&
        f[1][1] === 'ste_name'
      );
    };

    if (Array.isArray(filter) && filter[0] === 'all') {
      const remainingFilters = filter
        .slice(1)
        .filter(f => !isSelectionFilter(f as maplibregl.FilterSpecification));
      return remainingFilters.length > 0
        ? (['all', ...remainingFilters] as maplibregl.FilterSpecification)
        : null;
    }

    if (isSelectionFilter(filter)) {
      return null;
    }

    return filter;
  };

  useEffect(() => {
    if (!mapInstance) {
      return;
    }

    updateStatesVisibility(mapInstance, isVisible);

    const currentStateName =
      selectedState?.properties?.ste_name ||
      selectedCounty?.properties?.ste_name;

    // Update state layers
    mapInstance
      .getStyle()
      .layers.filter(
        layer =>
          layer.id.startsWith('states-') || layer.id.startsWith('state-'),
      )
      .forEach(layer => {
        const layerId = layer.id;
        let currentFilter = mapInstance.getFilter(layerId);
        mapInstance.setFilter(layerId, removeSelectionFilters(currentFilter));
        currentFilter = mapInstance.getFilter(layerId);

        if (currentStateName) {
          const newFilter = [
            '!=',
            ['get', 'ste_name'],
            currentStateName,
          ] as maplibregl.FilterSpecification;
          mapInstance.setFilter(
            layerId,
            addFilterToSpec(currentFilter, newFilter),
          );
        }
      });

    // Update county layers
    mapInstance
      .getStyle()
      .layers.filter(
        layer =>
          layer.id.startsWith('counties-') || layer.id.startsWith('county-'),
      )
      .forEach(layer => {
        const layerId = layer.id;
        let currentFilter = mapInstance.getFilter(layerId);
        mapInstance.setFilter(layerId, removeSelectionFilters(currentFilter));
        currentFilter = mapInstance.getFilter(layerId);

        if (currentStateName) {
          const newFilter = [
            '==',
            ['get', 'ste_name'],
            currentStateName,
          ] as maplibregl.FilterSpecification;
          mapInstance.setFilter(
            layerId,
            addFilterToSpec(currentFilter, newFilter),
          );
        }
      });
  }, [mapInstance, selectedState, selectedCounty, isVisible]);

  const handleZoomOut = () => {
    if (!mapInstance) {
      return;
    }

    let targetZoom = 4.2; // Default to national view
    if (currentZoom >= 8) {
      targetZoom = 6; // County -> State

      if (selectedCounty) {
        const stateName = selectedCounty.properties?.ste_name;
        if (stateName) {
          const statesSource = mapInstance.getSource('statesData');
          if (statesSource && statesSource.type === 'geojson') {
            const statesData = statesSource.serialize().data;
            const stateFeature = statesData.features.find(
              (feature: maplibregl.MapGeoJSONFeature) =>
                feature.properties?.ste_name === stateName,
            );
            if (stateFeature) {
              onStateSelect(stateFeature);
              setTimeout(() => {
                zoomToState(mapInstance, stateFeature);
              }, 10);
              return;
            }
          }
        }
      }
    } else if (currentZoom >= 6) {
      targetZoom = 4.2;
      onStateSelect(null);
      onCountySelect(null);
    }

    setTimeout(() => {
      mapInstance.flyTo({
        ...(targetZoom === 4.2 ? { center: [0, 0] } : {}),
        zoom: targetZoom,
        essential: true,
      });
    }, 30);
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      <Toggle map={mapInstance} isVisible={isVisible} onToggle={setIsVisible} />
      {currentZoom > 4.2 && <ZoomControls onZoomOut={handleZoomOut} />}
      <Legend map={mapInstance} isVisible={isVisible} />
      <MapHighlights
        map={mapInstance}
        selectedState={selectedState}
        selectedCounty={selectedCounty}
      />
    </div>
  );
};

export default Map;
