import React, { useState, useEffect } from "react";
import placeholderIcon from "../assets/placeholder_icon.png";
import { Incentive } from "../mocks/types";
import { IncentiveCard } from "./incentive-card";
import { mockIncentivesData } from "../mocks/data";

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
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { stateData, onChipSelectionChange, onClose } = props;

  const [isVisible, setIsVisible] = useState(false);
  const [chips, setChips] = useState<ChipData[]>([
    { id: "chip1", label: "Incentive 1", selected: true },
    { id: "chip2", label: "Incentive 2", selected: true },
    { id: "chip3", label: "Incentive 3", selected: true },
    { id: "chip4", label: "Incentive 4", selected: true },
    { id: "chip5", label: "Incentive 5", selected: true },
    { id: "chip6", label: "Incentive 6", selected: true },
    { id: "chip7", label: "Incentive 7", selected: true },
    { id: "chip8", label: "Incentive 8", selected: true },
    { id: "chip9", label: "Incentive 9", selected: true },
  ]);

  useEffect(() => {
    // Show the sidebar if stateData exists; hide otherwise
    setIsVisible(!!stateData);
  }, [stateData]);

  const toggleChip = (id: string) => {
    const updatedChips = chips.map((chip) =>
      chip.id === id ? { ...chip, selected: !chip.selected } : chip
    );
    setChips(updatedChips);
    if (onChipSelectionChange) {
      onChipSelectionChange(updatedChips);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  // If not visible, render nothing
  if (!isVisible) {
    return null;
  }

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

      {/* Add some top padding so content sits below the close button */}
      <div className="pt-12 px-3 pb-4">
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {chips.map((chip) => (
            <button
              key={chip.id}
              onClick={() => toggleChip(chip.id)}
              className={
                chip.selected
                  ? "flex items-center px-2 py-1 text-sm rounded-full bg-[#eed87e] text-black border-0"
                  : "flex items-center px-2 py-1 text-sm rounded-full bg-gray-300 text-gray-700 border-0"
              }
            >
              <input
                type="checkbox"
                checked={chip.selected}
                readOnly
                className="mr-1"
              />
              <img
                src={placeholderIcon}
                alt="icon"
                className="w-4 h-4 mr-1"
              />
              <span>{chip.label}</span>
            </button>
          ))}
        </div>

        {stateData ? (
          <div>
            <h2 className="text-xl font-bold mb-2">{stateData.name}</h2>
            <p>{stateData.description}</p>
            <div className="mt-4 space-y-4">
              {mockIncentivesData.incentives.map((incentive: Incentive) => (
                <IncentiveCard
                  key={incentive.id}
                  typeChips={incentive.payment_methods}
                  headline={incentive.program}
                  subHeadline={incentive.eligible_geo_group || ""}
                  body={incentive.short_description.en}
                  warningChip={
                    incentive.low_income ? "Low Income Eligible" : null
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
    </div>
  );
};

export default Sidebar;
