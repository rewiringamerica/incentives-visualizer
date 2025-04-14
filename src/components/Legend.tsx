import maplibregl from 'maplibre-gl';
import { useEffect } from 'react';

interface LegendProps {
  map: maplibregl.Map | null;
  isVisible: boolean;
}

class CustomLegendControl {
  _map: maplibregl.Map | null = null;
  _container: HTMLDivElement | null = null;
  _isVisible: boolean | null = null;

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

  setVisibleState(state: boolean) {
    this._isVisible = state;
    this.updateLegend(); // Update when state changes
  }

  updateLegend() {
    if (!this._map || !this._container) {
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

    // if at county zoom level, show different legend
    const zoom = this._map.getZoom();
    const isCountyZoom = zoom >= 6;

    // if on state view, show state labels
    // check if the map is toggled to incentive or coverage view
    let label1 = '';
    let label2 = '';
    let label3 = '';

    // if on county view, show county labels
    if (isCountyZoom) {
      // numbers are arbitrary, can be changed later
      label1 = '20+ Incentives';
      label2 = '10-19 Incentives';
      label3 = '1-9 Incentives';
    } else if (this._isVisible) {
      label1 = 'Supported';
      label2 = 'Coming Soon';
      label3 = 'Not Supported';
    } else {
      label1 = '10-20 Incentives';
      label2 = '1-9 Incentives';
      label3 = 'No Incentives';
    }

    this._container.innerHTML = `
      <strong>Legend</strong>
      <div style="display: flex; align-items: center; margin-top: 5px; width: 8vw; margin-bottom: 1vh;">
        <span style="
          width: 20px; height: 20px; 
          background: ${fillColorCoverage}; 
          opacity: ${fillOpacityCoverage};
          border: 2px solid ${outlineColor || 'black'}; 
          margin-right: 5px; display: inline-block;">
        </span>
        <span>${label1}</span>
      </div>
      <div style="display: flex; align-items: center; margin-top: 5px; width: 8vw; margin-bottom: 1vh;">
        <span style="
            width: 20px; height: 20px; 
            background: ${fillColorBeta}; 
            opacity: ${fillOpacityBeta};
            border: 2px solid ${outlineColor || 'black'}; 
            margin-right: 5px; display: inline-block;">
          </span>
          <span>${label2}</span>
        </div>
        <div style="display: flex; align-items: center; margin-top: 5px; width: 8vw; margin-bottom: 0.5vh;">
          <span style="
            width: 20px; height: 20px; 
            background: ${fillColorNoCoverage}; 
            opacity: ${fillOpacityNoCoverage};
            border: 2px solid ${outlineColor || 'black'}; 
            margin-right: 5px; display: inline-block;">
          </span>
          <span>${label3}</span>
        </div>
        `;
  }
}

const Legend: React.FC<LegendProps> = ({ map, isVisible }) => {
  useEffect(() => {
    if (!map) {
      return;
    }

    const legendControl = new CustomLegendControl();
    map.addControl(legendControl, 'bottom-right');

    const update = () => legendControl.updateLegend();
    map.on('styledata', update);
    map.on('sourcedata', update);

    if (legendControl) {
      legendControl.setVisibleState(isVisible);
    }

    return () => {
      map.off('styledata', update);
      map.removeControl(legendControl);
    };
  }, [isVisible, map]);

  return null;
};

export default Legend;
