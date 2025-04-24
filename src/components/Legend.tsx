import { useEffect } from 'react';

interface LegendProps {
  map: maplibregl.Map | null;
  isVisible: boolean;
}

class CustomLegendControl {
  _map: maplibregl.Map | null = null;
  _container: HTMLDivElement | null = null;
  _isVisible: boolean | null = null;
  _popup: HTMLDivElement | null = null;

  initializeLegend(map: maplibregl.Map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className =
      'absolute bottom-16 right-2.5 bg-white p-2.5 rounded shadow-md z-50';
    this._container.innerHTML = '<strong>Legend</strong><br/>Loading...';
    document.body.appendChild(this._container);

    // Popup for legend description
    this._popup = document.createElement('div');
    this._popup.className =
      'hidden absolute bottom-full right-0 bg-white p-4 rounded shadow-md z-50 w-72 mb-5';
    this._popup.setAttribute('aria-hidden', 'true');
    this._popup.setAttribute('role', 'tooltip');
    this._popup.setAttribute('id', 'legend-popup');
    this._popup.innerHTML = `
      <p class="font-bold">What do these keys mean?</p>
      <p class="text-sm">Supported states have incentive data fully covered by Rewiring America's incentives API.
      Coming Soon states have incentive data that has not been fully vetted yet.</p>
    `;

    this._container.appendChild(this._popup);
    this._container.addEventListener('mouseenter', () => {
      if (this._popup && this._isVisible) {
        this._popup.style.display = 'block';
        this._popup.setAttribute('aria-hidden', 'false');
        this._popup.setAttribute('aria-live', 'polite');
      }
    });
    this._container.addEventListener('mouseleave', () => {
      if (this._popup) {
        this._popup.style.display = 'none';
        this._popup.setAttribute('aria-hidden', 'true');
      }
    });

    this.updateLegend();
  }

  setVisibleState(state: boolean) {
    this._isVisible = state;
    if (this._popup) {
      if (!state) {
        this._popup.style.display = state ? 'block' : 'none';
        this._popup.setAttribute('aria-hidden', state ? 'false' : 'true');
      }
    }
    this.updateLegend(); // Update when state changes
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

    // if at county zoom level, show different legend
    const zoom = this._map.getZoom();
    const isCountyZoom = zoom > 5;

    // if on state view, show state labels
    // check if the map is toggled to incentive or coverage view
    let label1 = '';
    let label2 = '';
    let label3 = '';
    let label4 = '';

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
      label1 = '60+ Incentives';
      label2 = '21-60 Incentives';
      label3 = 'No Incentives';
      label4 = '0-20 Incentives';
    }

    let incentiveLow = '';

    // if on incentive view, add extra label with color box for incentive-lo-layer
    if (!this._isVisible && !isCountyZoom) {
      incentiveLow = `
        <div style="display: flex; align-items: center; margin-top: 5px; width: 120px; margin-bottom: 5px; font-size: 14px;">
        <span style="
          width: 20px; height: 20px; 
          background: #6E33CF; 
          opacity: ${fillOpacityCoverage};
          border: 2px solid ${outlineColor || 'black'}; 
          margin-right: 5px; display: inline-block;">
        </span>
        <span>${label4}</span>
      </div>
      `;
    }

    this._container.innerHTML = `
      <strong style="font-size: 14px">Legend</strong>
      <ul aria-labelledby="legend-title" style="list-style: none; padding: 0; margin: 0;">
      <li style="display: flex; align-items: center; margin-top: 5px; width: 140px; margin-bottom: 5px; font-size: 14px;">
        <span style="
          width: 20px; height: 20px; 
          background: ${fillColorCoverage}; 
          opacity: ${fillOpacityCoverage};
          border: 2px solid ${outlineColor || 'black'}; 
          margin-right: 5px; display: inline-block;"
          aria-hidden="true">
        </span>
        <span>${label1}</span>
      </li>
      <li style="display: flex; align-items: center; margin-top: 5px; width: 140px; margin-bottom: 5px; font-size: 14px;">
        <span style="
            width: 20px; height: 20px; 
            background: ${fillColorBeta}; 
            opacity: ${fillOpacityBeta};
            border: 2px solid ${outlineColor || 'black'}; 
            margin-right: 5px; display: inline-block;"
            aria-hidden="true">
          </span>
          <span>${label2}</span>
        </li>
        ${incentiveLow}
        <li style="display: flex; align-items: center; margin-top: 5px; width: 120px; font-size: 14px;">
          <span style="
            width: 20px; height: 20px; 
            background: ${fillColorNoCoverage}; 
            opacity: ${fillOpacityNoCoverage};
            border: 2px solid ${outlineColor || 'black'}; 
            margin-right: 5px; display: inline-block;"
            aria-hidden="true">
          </span>
          <span>${label3}</span>
        </div>
        `;

    this._container.appendChild(this._popup!);
  }

  removeLegend() {
    if (this._container?.parentNode) {
      this._container.parentNode.removeChild(this._container);
    }
  }
}

const Legend: React.FC<LegendProps> = ({ map, isVisible }) => {
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

    if (legendControl) {
      legendControl.setVisibleState(isVisible);
    }

    return () => {
      map.off('styledata', update);
      map.off('sourcedata', update);
      legendControl.removeLegend();
    };
  }, [isVisible, map]);

  return null;
};

export default Legend;
