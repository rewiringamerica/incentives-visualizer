import React, { useState } from 'react';
import placeholderIcon from '../assets/placeholder_icon.png';
import { mockIncentivesData } from '../mocks/data';
import { Incentive } from '../mocks/types';
import { IncentiveCard } from './incentive-card';

export interface ChipData {
  id: string;
  label: string;
  selected: boolean;
}

interface SidebarProps {
  stateData?: {
    name: string;
    description: string;
  };
  onChipSelectionChange?: (chips: ChipData[]) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  stateData,
  onChipSelectionChange,
}) => {
  const [chips, setChips] = useState<ChipData[]>([
    { id: 'chip1', label: 'Incentive 1', selected: true },
    { id: 'chip2', label: 'Incentive 2', selected: true },
    { id: 'chip3', label: 'Incentive 3', selected: true },
    { id: 'chip4', label: 'Incentive 4', selected: true },
    { id: 'chip5', label: 'Incentive 5', selected: true },
    { id: 'chip6', label: 'Incentive 6', selected: true },
    { id: 'chip7', label: 'Incentive 7', selected: true },
    { id: 'chip8', label: 'Incentive 8', selected: true },
    { id: 'chip9', label: 'Incentive 9', selected: true },
  ]);

  const toggleChip = (id: string) => {
    const updatedChips = chips.map(chip =>
      chip.id === id ? { ...chip, selected: !chip.selected } : chip,
    );
    setChips(updatedChips);
    if (onChipSelectionChange) {
      onChipSelectionChange(updatedChips);
    }
  };

  return (
    <div className="w-2/5 h-full p-4 bg-gray-100 overflow-y-auto">
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {chips.map(chip => (
          <button
            key={chip.id}
            onClick={() => toggleChip(chip.id)}
            className={`flex items-center px-2 py-1 text-sm rounded-full ${
              chip.selected
                ? 'bg-[#eed87e] text-black border-0'
                : 'bg-gray-300 text-gray-700 border-0'
            }`}
          >
            {/* Checkbox */}
            <input
              type="checkbox"
              checked={chip.selected}
              readOnly
              className="mr-1"
            />
            {/* Icon */}
            <img src={placeholderIcon} alt="icon" className="w-4 h-4 mr-1" />
            {/* Text */}
            <span>{chip.label}</span>
          </button>
        ))}
      </div>
      {/* State details section */}
      {stateData ? (
        <div>
          <h2 className="text-xl font-bold mb-2">{stateData.name}</h2>
          <p>{stateData.description}</p>
          {/* Incentives List */}
          <div className="mt-4 space-y-4">
            {mockIncentivesData.incentives.map((incentive: Incentive) => (
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
        <p>Select a state on the map to view details.</p>
      )}
    </div>
  );
};

export default Sidebar;
