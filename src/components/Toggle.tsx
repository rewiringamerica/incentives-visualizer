import maplibregl from 'maplibre-gl';
import React, { useEffect, useState } from 'react';

interface ToggleProps {
  map: maplibregl.Map | null;
  isVisible: boolean;
  onToggle?: (visible: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ map, isVisible, onToggle }) => {
  const [showToggle, setShowToggle] = useState(true);

  useEffect(() => {
    if (!map) {
      return;
    }

    const checkZoom = () => {
      const zoom = map.getZoom();
      setShowToggle(zoom <= 4.2); // only show toggle if zoomed out
    };

    map.on('zoom', checkZoom);
    checkZoom(); // initial check

    return () => {
      map.off('zoom', checkZoom);
    };
  }, [map]);

  if (!showToggle) {
    return null;
  }

  const toggle = () => {
    if (onToggle) {
      onToggle(!isVisible);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '250px',
        right: '10px',
        zIndex: 10,
      }}
    >
      <div
        onClick={toggle}
        style={{
          width: '185px',
          height: '50px',
          backgroundColor: '#6C7484',
          borderRadius: '25px',
          display: 'flex',
          alignItems: 'center',
          padding: '5px',
          cursor: 'pointer',
          boxShadow: '0 0 8px rgba(0,0,0,0.2)',
          position: 'relative',
          transition: 'background-color 0.3s ease',
        }}
      >
        <div
          style={{
            flex: 1,
            fontSize: '14px',
            textAlign: 'center',
            fontWeight: !isVisible ? 'bold' : 'normal',
            color: !isVisible ? '#1E1E1E' : 'white',
            zIndex: 1,
            userSelect: 'none',
          }}
        >
          Incentive View
        </div>
        <div
          style={{
            flex: 1,
            fontSize: '14px',
            textAlign: 'center',
            marginLeft: '10px',
            fontWeight: isVisible ? 'bold' : 'normal',
            color: isVisible ? '#1E1E1E' : 'white',
            zIndex: 1,
            userSelect: 'none',
          }}
        >
          Coverage View
        </div>

        <div
          style={{
            position: 'absolute',
            top: '5px',
            left: !isVisible ? '5px' : 'calc(50% + 5px)',
            width: 'calc(50% - 10px)',
            height: '40px',
            backgroundColor: 'white',
            borderRadius: '20px',
            boxShadow: '0 0 5px rgba(0,0,0,0.15)',
            transition: 'left 0.3s ease',
          }}
        />
      </div>
    </div>
  );
};

export default Toggle;
