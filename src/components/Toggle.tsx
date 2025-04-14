import maplibregl from 'maplibre-gl';

interface ToggleProps {
  map: maplibregl.Map | null;
  isVisible: boolean;
  onToggle?: (visible: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ isVisible, onToggle }) => {
  const toggleLayers = () => {
    if (onToggle) {
      onToggle(!isVisible); // Toggle visibility state
    }
  };

  return (
    <button
      onClick={toggleLayers}
      style={{
        position: 'absolute',
        bottom: '200px',
        right: '10px',
        padding: '10px',
        background: 'white',
        cursor: 'pointer',
        boxShadow: '0px 0px 5px rgba(0,0,0,0.2)',
        borderRadius: '5px',
      }}
    >
      {isVisible ? 'Hide Layers' : 'Show Layers'}
    </button>
  );
};

export default Toggle;
