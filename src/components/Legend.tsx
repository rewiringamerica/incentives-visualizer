import { useEffect } from 'react';

class CustomLegendControl {
  _map: maplibregl.Map | null = null;
  _container: HTMLDivElement | null = null;

  initializeLegend(map: maplibregl.Map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className =
      'absolute bottom-2.5 right-2.5 bg-white p-2.5 rounded shadow-md z-50';
    this._container.innerHTML = '<strong>Legend</strong><br/>Loading...';
    document.body.appendChild(this._container);
    this.updateLegend();
  }

  updateLegend() {
    if (!this._container || !this._map) {
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
