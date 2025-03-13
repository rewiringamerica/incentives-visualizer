import { FC } from 'react';

export type IconProps = {
  w: number;
  h: number;
};

export const DownIcon: FC<IconProps> = ({ w, h }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    focusable="false"
    aria-hidden="true"
    viewBox="0 0 17 15"
    width={w}
    height={h}
    style={{
      opacity: 0.5,
      fill: 'none',
      verticalAlign: 'text-top',
    }}
  >
    <path
      d="M1.90137 1.92651L8.98672 7.62669C9.0241 7.65676 9.07756 7.65605 9.11413 7.62499L15.8241 1.92651"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
    ></path>
    <path
      d="M1.90137 7.67859L8.98672 13.3788C9.0241 13.4088 9.07756 13.4081 9.11413 13.3771L15.8241 7.67859"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
    ></path>
  </svg>
);

export const QuestionIcon: FC<IconProps> = ({ w, h }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={w}
    height={h}
    viewBox="0 0 24 24"
    opacity="0.5"
    style={{ verticalAlign: 'text-top' }}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

export const CalculatorTableIcon: FC<IconProps> = ({ w, h }) => (
  <svg
    width={w}
    height={h}
    viewBox="0 0 43 43"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="21.6223" cy="21.425" r="21.2058" fill="#F9D65B" />
    <path
      d="M16.7109 23.4374L22.917 15.2061L21.2661 21.3486L26.533 21.3787L20.6411 29.5298L22.0715 23.3739L16.7109 23.4374Z"
      fill="#400AB7"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.8799 7.38469C21.2899 6.97464 21.9547 6.97463 22.3648 7.38469L35.1313 20.1512C35.7928 20.8127 35.3243 21.9437 34.3889 21.9437H31.776V32.8611C31.776 33.441 31.3059 33.9111 30.726 33.9111H12.3704C11.7905 33.9111 11.3204 33.441 11.3204 32.8611V21.9437H8.85582C7.92037 21.9437 7.45189 20.8127 8.11335 20.1512L20.8799 7.38469ZM21.6223 8.76354L9.94221 20.4437H11.7704C12.3503 20.4437 12.8204 20.9138 12.8204 21.4937V32.4111H30.276V21.4937C30.276 20.9138 30.7461 20.4437 31.326 20.4437H33.3025L21.6223 8.76354Z"
      fill="#400AB7"
    />
  </svg>
);

export const LightningBolt: FC<IconProps> = ({ w, h }) => (
  <svg
    width={w}
    height={h}
    viewBox="0 0 38 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.808594 36.8235L23.6951 0.682129L17.6068 27.6524L37.0301 27.7845L15.3021 63.5737L20.577 36.5447L0.808594 36.8235Z"
      fill="#F9D65B"
    />
  </svg>
);

export const ExclamationPoint: FC<IconProps> = ({ w, h }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={w}
    height={h}
    viewBox="0 0 16 16"
    fill="none"
  >
    <rect width="16" height="16" rx="2" fill="#806c23" />
    <rect
      x="9.12494"
      y="8.12549"
      width="2.25"
      height="5.25"
      rx="1.125"
      transform="rotate(-180 9.12494 8.12549)"
      fill="#FEF2CA"
      stroke="#FEF2CA"
      strokeWidth="0.25"
    />
    <rect
      x="9.12494"
      y="13.1255"
      width="2.25"
      height="2.25"
      rx="1.125"
      transform="rotate(-180 9.12494 13.1255)"
      fill="#FEF2CA"
      stroke="#FEF2CA"
      strokeWidth="0.25"
    />
  </svg>
);

export const UpRightArrow: FC<IconProps> = ({ w, h }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={w}
    height={h}
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M5.83325 14.1667L14.1666 5.83337"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.83325 5.83337H14.1666V14.1667"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DownTriangle: FC<IconProps> = ({ w, h }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={w}
    height={h}
    viewBox="0 0 11 5"
    fill="none"
  >
    <path d="M0 0H11L5.5 5L0 0Z" fill="currentColor" />
  </svg>
);

export const Check: FC<IconProps> = ({ w, h }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={w}
    height={h}
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M16.6667 5.83334L7.50004 15L3.33337 10.8333"
      stroke="#6B6B6B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ExternalLink: FC<IconProps> = ({ w, h }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={w}
    height={h}
    viewBox="0 0 20 20"
    fill="none"
  >
    <path
      d="M15 10.8333V15.8333C15 16.2754 14.8244 16.6993 14.5118 17.0118C14.1993 17.3244 13.7754 17.5 13.3333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V6.66667C2.5 6.22464 2.67559 5.80072 2.98816 5.48816C3.30072 5.17559 3.72464 5 4.16667 5H9.16667"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.5 2.5H17.5V7.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.33398 11.6667L17.5007 2.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
