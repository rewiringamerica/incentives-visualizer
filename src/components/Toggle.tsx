import maplibregl from 'maplibre-gl';

interface ToggleProps {
  map: maplibregl.Map | null;
  isVisible: boolean;
  onToggle?: (visible: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ isVisible, onToggle }) => {
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
          backgroundColor: '#f3f4f6',
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
            color: !isVisible ? '#333' : '#888',
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
            fontWeight: isVisible ? 'bold' : 'normal',
            color: isVisible ? '#333' : '#888',
            zIndex: 1,
            userSelect: 'none',
          }}
        >
          Coverage View
        </div>

        {/* Sliding Indicator */}
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
