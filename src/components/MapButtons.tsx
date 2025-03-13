import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";

interface MapButtonsProps {
  setMapView: (center: [number, number], maxBounds: [[number, number], [number, number]]) => void;
  mapStyle: maplibregl.StyleSpecification | undefined;
}

const MapButtons: React.FC<MapButtonsProps> = ({ setMapView, mapStyle }) => {
  const mainlandRef = useRef<HTMLDivElement | null>(null);
  const alaskaRef = useRef<HTMLDivElement | null>(null);
  const hawaiiRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const initInsetMap = (container: HTMLDivElement | null, center: [number, number], zoom: number) => {
      if (!container) return;

      const insetMap = new maplibregl.Map({
        container,
        style: mapStyle, 
        center,
        zoom,
        interactive: false, 
        attributionControl: false,
      });

    };

    initInsetMap(mainlandRef.current, [-98.5795, 39.8283], 0);
    initInsetMap(alaskaRef.current, [-152.4044, 64.2008], 0);
    initInsetMap(hawaiiRef.current, [-157.8583, 21.3069], 0);
  }, [mapStyle]); 

  return (
    <div className="absolute bottom-5 left-5 flex flex-row gap-3 z-[1000]">
      {/* Mainland USA */}
      <div
        ref={mainlandRef}
        className="w-20 h-14 border-2 border-white rounded-md cursor-pointer shadow-md"
        onClick={() => setMapView([-98.5795, 39.8283], [[-130, 23], [-65, 50]])}
      />

      {/* Alaska */}
      <div
        ref={alaskaRef}
        className="w-20 h-14 border-2 border-white rounded-md cursor-pointer shadow-md"
        onClick={() => setMapView([-152.4044, 64.2008], [[-180, 50], [-130, 72]])}
      />

      {/* Hawaii */}
      <div
        ref={hawaiiRef}
        className="w-20 h-14 border-2 border-white rounded-md cursor-pointer shadow-md"
        onClick={() => setMapView([-157.8583, 21.3069], [[-161, 18], [-154, 23]])}
      />

    </div>
  );
};

export default MapButtons;