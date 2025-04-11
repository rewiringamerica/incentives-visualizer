import { Autocomplete, TextField } from '@mui/material';
import React, { useState } from 'react';
import logo from '../assets/logo.png';
import geojsonData from '../data/geojson/states-albers.json';
import { US_STATE_NAMES } from '../data/states';

interface NavbarProps {
  map: maplibregl.Map;
  zoomToState: (
    map: maplibregl.Map,
    feature: maplibregl.MapGeoJSONFeature,
  ) => void;
  onFeatureSelect: (feature: maplibregl.MapGeoJSONFeature) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  map,
  zoomToState,
  onFeatureSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (
    event: React.SyntheticEvent<Element, Event>,
    value: string,
  ) => {
    setSearchTerm(value);
  };

  const handleSubmit = () => {
    if (searchTerm.trim()) {
      const stateName = searchTerm.trim();

      const feature = geojsonData.features.find(f => {
        const steNameRaw = f.properties?.ste_name;
        // Since steName is in form ['name'], we need to parse it
        const steName = Array.isArray(steNameRaw)
          ? steNameRaw[0]
          : steNameRaw?.replace(/^\['|'\]$/g, '');

        return steName === stateName;
      });

      if (feature) {
        onFeatureSelect(feature as maplibregl.MapGeoJSONFeature);
        zoomToState(map, feature as maplibregl.MapGeoJSONFeature);
      } else {
        console.error(`State "${searchTerm}" not found.`);
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
          options={US_STATE_NAMES}
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
