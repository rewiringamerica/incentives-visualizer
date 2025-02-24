import React from "react";

const Legend: React.FC = () => {
  return (
    <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md text-sm">
      <h3 className="font-bold mb-2">Legend</h3>
      <div className="flex items-center">
        <span className="w-4 h-4 bg-yellow-400 border border-black mr-2"></span>
        <span>States</span>
      </div>
    </div>
  );
};

export default Legend;
