import Tooltip from '@mui/material/Tooltip';
import clsx from 'clsx';
import { FC, PropsWithChildren, useEffect, useRef, useState } from 'react';
import { Card } from './card';
import { ExclamationPoint, ExternalLink, UpRightArrow } from './icons';

const Chip: FC<PropsWithChildren<{ isWarning?: boolean }>> = ({
  isWarning,
  children,
}) => (
  <div
    className={clsx(
      'flex',
      'w-fit',
      'gap-2.5',
      'items-center',
      'justify-center',
      'rounded',
      'font-bold',
      'text-xsm',
      'leading-tight',
      'tracking-[0.03438rem]',
      'uppercase',
      'whitespace-nowrap',
      isWarning &&
        'bg-yellow-200 text-[#806c23] py-[0.1875rem] pl-[0.1875rem] pr-2.5',
      !isWarning && 'bg-purple-100 text-grey-700 px-2.5 py-1',
    )}
  >
    {isWarning ? <ExclamationPoint w={16} h={16} /> : null}
    {children}
  </div>
);

/** Rendered as a button, with a border. Narrow layout only. */
const BorderedLinkButton: FC<PropsWithChildren<{ href: string }>> = ({
  href,
  children,
}) => (
  <a
    className={clsx(
      'flex',
      'sm:hidden',
      'gap-2',
      'justify-center',
      'items-center',
      'self-stretch',
      'h-9',
      'px-3.5',
      'py-1.5',
      'border',
      'rounded',
      'border-grey-300',
      'text-ra-color-text-link',
      'text-base',
      'font-medium',
      'leading-tight',
    )}
    target="_blank"
    href={href}
  >
    {children}
  </a>
);

/** Rendered as a pseudo-link, without a border. Med and wide layouts only */
const BorderlessLinkButton: FC<PropsWithChildren<{ href: string }>> = ({
  href,
  children,
}) => (
  <a
    className={clsx(
      'hidden',
      'sm:flex',
      'gap-2',
      'items-center',
      'text-ra-color-text-link',
      'text-base',
      'font-medium',
      'leading-tight',
      'whitespace-nowrap',
      'hover:underline',
    )}
    target="_blank"
    href={href}
  >
    {children}
  </a>
);

const TruncatedTextWithTooltip: FC<{ text: string; className: string }> = ({
  text,
  className,
}) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const checkTruncation = () => {
    if (textRef.current) {
      setIsTruncated(
        textRef.current.scrollHeight > textRef.current.clientHeight ||
          textRef.current.scrollWidth > textRef.current.clientWidth,
      );
    }
  };

  useEffect(() => {
    checkTruncation();
    window.addEventListener('resize', checkTruncation);

    return () => {
      window.removeEventListener('resize', checkTruncation);
    };
  }, []);

  return (
    <Tooltip title={isTruncated ? text : ''} arrow>
      <div
        ref={textRef}
        className={`${className} text-ellipsis overflow-hidden`}
        onMouseEnter={checkTruncation}
      >
        {text}
      </div>
    </Tooltip>
  );
};

export const IncentiveCard: FC<{
  typeChips: string[];
  headline: string;
  subHeadline: string;
  body: string;
  warningChip: string | null;
  buttonUrl: string | null;
}> = ({ typeChips, headline, subHeadline, body, warningChip, buttonUrl }) => (
  <Card padding="small" role="region" aria-labelledby={`headline-${headline}`}>
    <div className="flex gap-4 justify-between items-baseline">
      <TruncatedTextWithTooltip
        text={headline}
        className="text-grey-900 text-lg font-medium leading-normal max-w-xs"
      />
      {buttonUrl && (
        <BorderlessLinkButton
          href={buttonUrl}
          aria-label={`Learn more about ${headline}`}
        >
          <ExternalLink w={20} h={20} />
        </BorderlessLinkButton>
      )}
    </div>

    <TruncatedTextWithTooltip
      text={subHeadline}
      className="text-grey-400 text-base font-medium leading-tight max-w-xs"
    />

    <TruncatedTextWithTooltip
      text={body}
      className="text-grey-600 text-base leading-normal max-w-xs line-clamp-3"
    />

    <div className="flex flex-wrap gap-2.5" aria-label="Incentive details">
      {typeChips.map((chip, index) => (
        <Chip key={index}>{chip}</Chip>
      ))}
      {warningChip && <Chip isWarning={true}>{warningChip}</Chip>}
    </div>

    {buttonUrl && (
      <BorderedLinkButton
        href={buttonUrl}
        aria-label={`Learn more about ${headline}`}
      >
        <UpRightArrow w={20} h={20} />
      </BorderedLinkButton>
    )}
  </Card>
);
