import { useEffect } from 'react';

class CustomLegendControl {
  _map: maplibregl.Map | null = null;
  _container: HTMLDivElement | null = null;
  _popup: HTMLDivElement | null = null;

  initializeLegend(map: maplibregl.Map) {
    this._map = map;
    this._container = document.createElement('div');
    this._container.className =
      'absolute bottom-16 right-2.5 bg-white p-2.5 rounded shadow-md z-50'; // Adjusted bottom position
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
      if (this._popup) {
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
      <strong id="legend-title">Legend</strong>
      <ul aria-labelledby="legend-title" style="list-style: none; padding: 0; margin: 0;">
        <li style="display: flex; align-items: center; margin-top: 5px; margin-bottom: 2vh;">
          <span style="
            width: 20px; height: 20px; 
            background: ${fillColorCoverage}; 
            opacity: ${fillOpacityCoverage};
            border: 2px solid ${outlineColor || 'black'}; 
            margin-right: 5px; display: inline-block;"
            aria-hidden="true">
          </span>
          <span>Supported</span>
        </li>
        <li style="display: flex; align-items: center; margin-top: 5px; margin-bottom: 2vh;">
          <span style="
            width: 20px; height: 20px; 
            background: ${fillColorBeta}; 
            opacity: ${fillOpacityBeta};
            border: 2px solid ${outlineColor || 'black'}; 
            margin-right: 5px; display: inline-block;"
            aria-hidden="true">
          </span>
          <span>Coming Soon</span>
        </li>
        <li style="display: flex; align-items: center; margin-top: 5px; margin-bottom: 0.5vh;">
          <span style="
            width: 20px; height: 20px; 
            background: ${fillColorNoCoverage}; 
            opacity: ${fillOpacityNoCoverage};
            border: 2px solid ${outlineColor || 'black'}; 
            margin-right: 5px; display: inline-block;"
            aria-hidden="true">
          </span>
          <span>Not Supported</span>
        </li>
      </ul>
    `;

    this._container.appendChild(this._popup!);
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
