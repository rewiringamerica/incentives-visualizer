import React, { useEffect, useState } from 'react';
import { mockIncentivesData } from '../mocks/data';
import { Incentive } from '../mocks/types';
import { IncentiveCard } from './incentive-card';
import IncentivesFilter from './IncentivesFilter';

// Added dictionary mapping full state names to abbreviations
const STATE_NAME_TO_ABBR: { [key: string]: string } = {
  Alabama: 'AL',
  Alaska: 'AK',
  Arizona: 'AZ',
  Arkansas: 'AR',
  California: 'CA',
  Colorado: 'CO',
  Connecticut: 'CT',
  Delaware: 'DE',
  Florida: 'FL',
  Georgia: 'GA',
  Hawaii: 'HI',
  Idaho: 'ID',
  Illinois: 'IL',
  Indiana: 'IN',
  Iowa: 'IA',
  Kansas: 'KS',
  Kentucky: 'KY',
  Louisiana: 'LA',
  Maine: 'ME',
  Maryland: 'MD',
  Massachusetts: 'MA',
  Michigan: 'MI',
  Minnesota: 'MN',
  Mississippi: 'MS',
  Missouri: 'MO',
  Montana: 'MT',
  Nebraska: 'NE',
  Nevada: 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  Ohio: 'OH',
  Oklahoma: 'OK',
  Oregon: 'OR',
  Pennsylvania: 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  Tennessee: 'TN',
  Texas: 'TX',
  Utah: 'UT',
  Vermont: 'VT',
  Virginia: 'VA',
  Washington: 'WA',
  'West Virginia': 'WV',
  Wisconsin: 'WI',
  Wyoming: 'WY',
};

interface SidebarProps {
  stateData?: {
    name: string;
    description: string;
  };
  countyData?: {
    name: string;
    description: string;
  };
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = props => {
  const { stateData, countyData, onClose } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [filterOptions, setFilterOptions] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  useEffect(() => {
    if (stateData) {
      const stateAbbr = STATE_NAME_TO_ABBR[stateData.name] || '';
      const filteredIncentives = mockIncentivesData.incentives.filter(
        incentive => stateAbbr && incentive.id.startsWith(stateAbbr + '-'),
      );
      const optionsSet = new Set<string>();
      filteredIncentives.forEach(incentive => {
        incentive.items.forEach(item => optionsSet.add(item));
      });
      const options = Array.from(optionsSet);
      setFilterOptions(options);
      setSelectedFilters(options);
    } else {
      setFilterOptions([]);
      setSelectedFilters([]);
    }
  }, [stateData]);

  useEffect(() => {
    setIsVisible(!!stateData || !!countyData);
  }, [stateData, countyData]);

  const handleFilterChange = (selected: string[]) => {
    setSelectedFilters(selected);
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) {
    return null;
  }

  const stateAbbr = stateData ? STATE_NAME_TO_ABBR[stateData.name] || '' : '';
  const stateIncentives = stateData
    ? mockIncentivesData.incentives.filter(
        incentive => stateAbbr && incentive.id.startsWith(stateAbbr + '-'),
      )
    : mockIncentivesData.incentives;

  const filteredIncentives =
    selectedFilters.length > 0
      ? stateIncentives.filter(incentive =>
          incentive.items.some(item => selectedFilters.includes(item)),
        )
      : []; // Return empty array instead of all state incentives when no filters are selected

  return (
    <div className="w-2/5 h-full bg-gray-100 relative overflow-y-auto">
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200"
        aria-label="Close sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="pt-12 px-3 pb-4">
        {stateData && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by incentive type
            </label>
            <IncentivesFilter
              options={filterOptions}
              selectedOptions={selectedFilters}
              onChange={handleFilterChange}
            />
            {selectedFilters.length === 0 && (
              <p className="mt-2 text-sm text-orange-600">
                Select at least one filter type to see available incentives.
              </p>
            )}
          </div>
        )}

        {stateData ? (
          <div>
            <h2 className="text-xl font-bold mb-2">{stateData.name}</h2>
            <p>{stateData.description}</p>
            <div className="mt-4 space-y-4">
              {filteredIncentives.length > 0 ? (
                filteredIncentives.map((incentive: Incentive) => (
                  <IncentiveCard
                    key={incentive.id}
                    typeChips={incentive.payment_methods}
                    headline={incentive.program}
                    subHeadline={incentive.eligible_geo_group || ''}
                    body={incentive.short_description.en}
                    warningChip={
                      incentive.low_income ? 'Low Income Eligible' : null
                    }
                    buttonUrl={incentive.more_info_url?.en || null}
                  />
                ))
              ) : (
                <p className="text-gray-500">
                  No incentives match the selected filters.
                </p>
              )}
            </div>
          </div>
        ) : countyData ? (
          <div>
            <h2 className="text-xl font-bold mb-2">{countyData.name}</h2>
            <p>{countyData.description}</p>
            <div className="mt-4 space-y-4">
              {filteredIncentives.map((incentive: Incentive) => (
                <IncentiveCard
                  key={incentive.id}
                  typeChips={incentive.payment_methods}
                  headline={incentive.program}
                  subHeadline={incentive.eligible_geo_group || ''}
                  body={incentive.short_description.en}
                  warningChip={
                    incentive.low_income ? 'Low Income Eligible' : null
                  }
                  buttonUrl={incentive.more_info_url?.en || null}
                />
              ))}
            </div>
          </div>
        ) : (
          <p>Select a state or county on the map to view details.</p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
