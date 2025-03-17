import React, { useState } from 'react';
import logo from '../assets/logo.png';

const Navbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Enter your state, county, or address"
          className="w-full pl-4 pr-12 py-2 rounded border border-gray-300 bg-white focus:outline-none"
        />
        <button
          className={`absolute right-1 top-1 h-[calc(100%-0.5rem)] w-8 flex items-center justify-center rounded ${buttonClass} text-white focus:outline-none`}
        >
          →
        </button>
      </div>
      {/* Language dropdown */}
      <div className="absolute right-4 flex-shrink-0">
        <select className="bg-[#eed87e] h-8 rounded focus:outline-none border-0">
          <option value="EN" selected>
            EN
          </option>
          <option value="ES">ES</option>
        </select>
      </div>
    </nav>
  );
};

export default Navbar;
