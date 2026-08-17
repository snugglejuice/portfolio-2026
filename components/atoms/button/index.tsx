import { ButtonHTMLAttributes } from 'react';
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
  ...props
}: ButtonProps) {
  const Tag = props.href ? 'a' : 'button';
  return (
    <Tag
      {...props}
      className={cx(
        'group',
        'relative cursor-pointer',
        'after:bg-black after:content-[""] after:w-full after:h-full after:absolute after:top-3 after:left-3 after:z-0',
        props?.className,
        {
          'w-max': !fullWidth,
          'w-full': fullWidth,
        },
      )}
    >
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
    </Tag>
  );
}
