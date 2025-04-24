import { useEffect } from 'react';

class CustomLegendControl {
  _map: maplibregl.Map | null = null;
  _container: HTMLDivElement | null = null;

  initializeLegend(map: maplibregl.Map) {
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

    // Stop event propagation for the legend container
    this._container.addEventListener('mousedown', e => e.stopPropagation());
    this._container.addEventListener('touchstart', e => e.stopPropagation());
    this._container.addEventListener('click', e => e.stopPropagation());

    document.body.appendChild(this._container);
    this.updateLegend();
  }

  updateLegend() {
    if (!this._container) {
      console.error('Legend container is not initialized.');
      return;
    }

    // updates the legend with map style for state
    const outlineColor = this._map.getPaintProperty(
      'states-layer',
      'fill-outline-color',
    );

    const fillColorCoverage = this._map.getPaintProperty(
      'states-coverage-layer',
      'fill-color',
    );
    const fillOpacityCoverage = this._map.getPaintProperty(
      'states-coverage-layer',
      'fill-opacity',
    );

    const fillColorBeta = this._map.getPaintProperty(
      'states-beta-layer',
      'fill-color',
    );
    const fillOpacityBeta = this._map.getPaintProperty(
      'states-beta-layer',
      'fill-opacity',
    );

    const fillColorNoCoverage = this._map.getPaintProperty(
      'states-no-coverage-layer',
      'fill-color',
    );
    const fillOpacityNoCoverage = this._map.getPaintProperty(
      'states-no-coverage-layer',
      'fill-opacity',
    );

    if (!fillColorCoverage) {
      return;
    }

    this._container.innerHTML = `
      <strong>Legend</strong>
      <div style="display: flex; align-items: center; margin-top: 5px; width: 8vw; margin-bottom: 2vh;">
        <span style="
          width: 20px; height: 20px; 
          background: ${fillColorCoverage}; 
          opacity: ${fillOpacityCoverage};
          border: 2px solid ${outlineColor || 'black'}; 
          margin-right: 5px; display: inline-block;">
        </span>
        <span>Covered States</span>
      </div>
      <div style="display: flex; align-items: center; margin-top: 5px; width: 8vw; margin-bottom: 1vh;">
        <span style="
          width: 20px; height: 20px; 
          background: ${fillColorBeta}; 
          opacity: ${fillOpacityBeta};
          border: 2px solid ${outlineColor || 'black'}; 
          margin-right: 5px; display: inline-block;">
        </span>
        <span>Beta States</span>
      </div>
      <div style="display: flex; align-items: center; margin-top: 5px; width: 8vw; margin-bottom: 0.5vh;">
        <span style="
          width: 20px; height: 20px; 
          background: ${fillColorNoCoverage}; 
          opacity: ${fillOpacityNoCoverage};
          border: 2px solid ${outlineColor || 'black'}; 
          margin-right: 5px; display: inline-block;">
        </span>
        <span>Uncovered States</span>
      </div>
    `;
  }

  removeLegend() {
    if (this._container?.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
  }
}

interface LegendProps {
  map: maplibregl.Map | null;
}

const Legend: React.FC<LegendProps> = ({ map }) => {
  useEffect(() => {
    if (!map) {
      return;
    }

    const legendControl = new CustomLegendControl();
    legendControl.initializeLegend(map);

    // Update legend when map style or data changes
    const update = () => legendControl.updateLegend();
    map.on('styledata', update);
    map.on('sourcedata', update);

    return () => {
      map.off('styledata', update);
      map.off('sourcedata', update);
      legendControl.removeLegend();
    };
  }, [map]);

  return null;
};

export default Legend;
