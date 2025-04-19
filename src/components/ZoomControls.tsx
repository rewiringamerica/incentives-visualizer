import { IconButton } from '@mui/material';
import { FC } from 'react';
import { UpRightArrow } from './icons';

interface ZoomControlsProps {
  onZoomOut: () => void;
}

const ZoomControls: FC<ZoomControlsProps> = ({ onZoomOut }) => {
  return (
    <div className="absolute top-4 left-4 z-10">
      <div className="bg-white rounded-lg shadow-lg p-2">
        <IconButton
          onClick={onZoomOut}
          className="hover:bg-gray-100"
          aria-label="zoom out"
        >
          <UpRightArrow w={24} h={24} />
        </IconButton>
      </div>
    </div>
  );
};

export default ZoomControls;
