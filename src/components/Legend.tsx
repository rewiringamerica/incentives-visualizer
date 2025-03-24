import maplibregl from 'maplibre-gl';
import { useEffect } from 'react';

class CustomLegendControl {
  _map: maplibregl.Map | null = null;
  _container: HTMLDivElement | null = null;

  onAdd(map: maplibregl.Map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className = 'legend';
    this._container.style.position = 'absolute';
    this._container.style.bottom = '10px';
    this._container.style.right = '10px';
    this._container.style.background = 'white';
    this._container.style.padding = '10px';
    this._container.style.marginBottom = '35px';
    this._container.style.borderRadius = '5px';
    this._container.style.boxShadow = '0px 0px 5px rgba(0,0,0,0.2)';
    this._container.innerHTML = '<strong>Legend</strong><br/>Loading...';

    this.updateLegend();
    return this._container;
  }

  onRemove() {
    if (this._container?.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
    this._map = null;
  }

  updateLegend() {
    if (!this._map || !this._container) {return;}

    // updates the legend with map style for state
    const fillColor = this._map.getPaintProperty('states-layer', 'fill-color');
    const outlineColor = this._map.getPaintProperty(
      'states-layer',
      'fill-outline-color',
    );
    const fillOpacity = this._map.getPaintProperty(
      'states-layer',
      'fill-opacity',
    );

    if (!fillColor) {return;}

    this._container.innerHTML = `
      <strong>Legend</strong>
      <div style="display: flex; align-items: center; margin-top: 5px;">
        <span style="
          width: 20px; height: 20px; 
          background: ${
            Array.isArray(fillColor) ? fillColor.join(', ') : fillColor
          }; 
          opacity: ${
            Array.isArray(fillOpacity) ? fillOpacity.join(', ') : fillOpacity
          };
          border: 2px solid ${outlineColor || 'black'}; 
          margin-right: 5px; display: inline-block;">
        </span>
        <span>US States</span>
      </div>
    `;
  }
}

interface LegendProps {
  map: maplibregl.Map | null;
}

const Legend: React.FC<LegendProps> = ({ map }) => {
  useEffect(() => {
    if (!map) {return;}

    const legendControl = new CustomLegendControl();
    map.addControl(legendControl as maplibregl.IControl, 'bottom-right');

    const update = () => legendControl.updateLegend();
    map.on('styledata', update);
    map.on('sourcedata', update);

    return () => {
      map.off('styledata', update);
      map.off('sourcedata', update);
      map.removeControl(legendControl as maplibregl.IControl);
    };
  }, [map]);

  return null;
};

export default Legend;
