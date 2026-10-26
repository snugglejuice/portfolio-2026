import { ButtonHTMLAttributes } from 'react';
import Link from 'next/link';
import cx from 'classnames';

interface ButtonProps {
  label: string;
  href?: string;
  className?: string;
  onClick?: ButtonHTMLAttributes<unknown>['onClick'];
  fullWidth?: boolean;
}

export default function Button({
  label,
  fullWidth = false,
  href,
  ...props
}: ButtonProps) {
  const className = cx(
    'group',
    'relative cursor-pointer',
    'after:bg-black after:content-[""] after:w-full after:h-full after:absolute after:top-3 after:left-3 after:z-0',
    props?.className,
    {
      'w-max': !fullWidth,
      'w-full': fullWidth,
    },
  );
  const content = (
    <span
      className={cx(
        'flex bg-white border-2 border-black py-4 px-5 relative z-10',
        'font-secondary font-bold text-2xl',
        'group-hover:translate-x-2 group-hover:translate-y-2 transition-all',
        {
          'w-max': !fullWidth,
          'w-full justify-center': fullWidth,
        },
      )}
    >
      {label}
    </span>
  );

  // Internal routes go through next/link: client-side navigation is what
  // lets view transitions (e.g. /work → project) animate.
  if (href?.startsWith('/')) {
    return (
      <Link {...props} href={href} className={className}>
        {content}
      </Link>
    );
  }

  const Tag = href ? 'a' : 'button';
  return (
    <Tag {...props} href={href} className={className}>
      {content}
    </Tag>
  );
}
