import { Autocomplete, TextField } from '@mui/material';
import React, { useState } from 'react';
import logo from '../assets/logo.png';
import countyGeojson from '../data/geojson/counties-albers.json';
import stateGeojson from '../data/geojson/states-albers.json';
import { CountyData } from './Counties';
import { StateData } from './States';

interface NavbarProps {
  map: maplibregl.Map;
  zoomToState: (
    map: maplibregl.Map,
    feature: maplibregl.MapGeoJSONFeature,
  ) => void;
  zoomToCounty: (
    map: maplibregl.Map,
    feature: maplibregl.MapGeoJSONFeature,
  ) => void;
  onStateSelect: (data: StateData) => void;
  onCountySelect: (data: CountyData) => void;
}

type SearchOption = {
  label: string;
  type: 'state' | 'county';
  feature?: maplibregl.MapGeoJSONFeature;
  data: StateData | CountyData;
};

const Navbar: React.FC<NavbarProps> = ({
  map,
  zoomToState,
  zoomToCounty,
  onStateSelect,
  onCountySelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const countiesFiltered = countyGeojson.features.filter(feature => {
    const coty_type = feature.properties?.coty_type;
    return coty_type && coty_type === 'county';
  });

  const statesFiltered = stateGeojson.features.filter(feature => {
    const ste_type = feature.properties?.ste_type;
    return ste_type && ste_type === 'state';
  });

  const searchOptions: SearchOption[] = [
    ...statesFiltered.map(feature => {
      const stateName = Array.isArray(feature.properties?.ste_name)
        ? feature.properties.ste_name[0]
        : feature.properties?.ste_name;

      let stateDisplayName = stateName;
      if (stateName === 'District of Columbia') {
        stateDisplayName = 'Washington, D.C.';
      }

      return {
        label: stateDisplayName,
        type: 'state',
        feature,
        data: {
          name: stateDisplayName || 'Unknown State',
          description: `Details about ${stateDisplayName}...`,
        } as StateData,
      };
    }),
    ...countiesFiltered.map(feature => {
      const countyName = Array.isArray(feature.properties?.coty_name)
        ? feature.properties.coty_name[0]
        : feature.properties?.coty_name;

      const stateName = Array.isArray(feature.properties?.ste_name)
        ? feature.properties.ste_name[0]
        : feature.properties?.ste_name;

      return {
        label: `${countyName}, ${stateName}`,
        type: 'county',
        feature,
        data: {
          name: countyName || 'Unknown County',
          description: `Details about ${countyName}...`,
        } as CountyData,
      };
    }),
  ];

  const handleSearchChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string,
  ) => {
    setSearchTerm(value);
  };

  const handleSubmit = () => {
    if (searchTerm.trim()) {
      const searchValue = searchTerm.trim();

      const searchOption = searchOptions.find(
        option => option.label === searchValue,
      );
      if (!searchOption) {
        console.error(`State/county "${searchValue}" not found.`);
        return;
      }

      const feature = searchOption.feature;
      const data = searchOption.data;

      if (feature && searchOption.type === 'state') {
        onStateSelect(data);
        zoomToState(map, feature);
      } else if (feature && searchOption.type === 'county') {
        onCountySelect(data);
        zoomToCounty(map, feature);
      } else {
        console.error(`State/county "${searchTerm}" not found.`);
      }
    }
  };

  // Change button color to #3d0db4 when there's text and make it darker upon hover, else keep it gray
  const buttonClass =
    searchTerm.trim().length > 0
      ? 'bg-[#3d0db4] hover:bg-[#270778]'
      : 'bg-gray-500 hover:bg-gray-500';

  return (
    <nav className="bg-[#f3d76f] p-4 relative flex items-center">
      {/* Logo */}
      <div className="flex-shrink-0">
        <img src={logo} alt="Logo" className="h-8" />
      </div>
      {/* Search bar */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2"
        style={{ maxWidth: '400px', width: '100%' }}
      >
        <Autocomplete
          options={searchOptions}
          inputValue={searchTerm}
          onInputChange={(event, value) => handleSearchChange(event, value)}
          disableClearable
          renderInput={params => (
            <TextField
              {...params}
              placeholder="Enter your state, county, or address"
              variant="outlined"
              fullWidth
              className="w-full pl-4 pr-12 py-2 rounded border border-gray-300 bg-white focus:outline-none"
            />
          )}
        />
        <button
          onClick={handleSubmit}
          className={`absolute right-1 top-1 h-[calc(100%-0.5rem)] w-10 flex items-center justify-center rounded ${buttonClass} text-white focus:outline-none`}
        >
          →
        </button>
      </div>
      {/* Language dropdown */}
      <div className="absolute right-4 flex-shrink-0">
        <select
          className="bg-[#eed87e] h-8 rounded focus:outline-none border-0"
          defaultValue="EN"
        >
          <option value="EN">EN</option>
          <option value="ES">ES</option>
        </select>
      </div>
    </nav>
  );
};

export default Navbar;
