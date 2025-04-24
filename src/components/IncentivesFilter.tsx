import React, { useState } from 'react';

interface IncentivesFilterProps {
  options: string[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
}

const IncentivesFilter: React.FC<IncentivesFilterProps> = ({
  options,
  selectedOptions,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      onChange(selectedOptions.filter(item => item !== option));
    } else {
      onChange([...selectedOptions, option]);
    }
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative w-full">
      <div
        onClick={toggleDropdown}
        className="w-full p-2.5 bg-white border border-gray-300 rounded-md flex justify-between items-center cursor-pointer"
        aria-expanded={isOpen}
        aria-controls="dropdown-menu"
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggleDropdown();
          }
        }}
      >
        <span className="text-sm text-gray-700">
          {selectedOptions.length === 0
            ? 'Select options'
            : selectedOptions.length === 1
            ? `1 option selected`
            : `${selectedOptions.length} options selected`}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {isOpen && (
        <div
          id="dropdown-content"
          role="listbox"
          tabIndex={-1}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          {options.length > 0 ? (
            <div className="p-2">
              <div className="mb-2 flex justify-between">
                <button
                  className="text-xs text-blue-600 hover:text-blue-800"
                  onClick={e => {
                    e.stopPropagation();
                    onChange(options);
                  }}
                >
                  Select All
                </button>
                <button
                  className="text-xs text-blue-600 hover:text-blue-800"
                  onClick={e => {
                    e.stopPropagation();
                    onChange([]);
                  }}
                >
                  Clear All
                </button>
              </div>
              {options.map(option => {
                const inputId = `option-${option}`;
                return (
                  <div
                    key={option}
                    className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                    role="option"
                    aria-selected={selectedOptions.includes(option)}
                  >
                    <input
                      type="checkbox"
                      id={inputId}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={selectedOptions.includes(option)}
                      onChange={e => {
                        e.stopPropagation();
                        toggleOption(option);
                      }}
                      tabIndex={0}
                    />
                    <label
                      htmlFor={inputId}
                      className="ml-2 text-sm text-gray-700 cursor-pointer"
                    >
                      {option.replace(/_/g, ' ')}
                    </label>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-sm text-gray-500">
              No options available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default IncentivesFilter;
