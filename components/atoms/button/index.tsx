import { ButtonHTMLAttributes } from 'react';
import cx from 'classnames';

interface ButtonProps {
  label: string;
  href?: string;
  onClick?: ButtonHTMLAttributes<unknown>['onClick'];
}

export default function Button({ label, ...props }: ButtonProps) {
  const Tag = props.href ? 'a' : 'button';
  return (
    <Tag
      {...props}
      className={cx(
        'group',
        'relative w-max',
        'after:bg-black after:content-[""] after:w-full after:h-full after:absolute after:top-3 after:left-3 after:z-0',
      )}
    >
      <span
        className={cx(
          'flex bg-white border-2 border-black py-4 px-5 w-max relative z-10',
          'font-secondary font-bold text-2xl',
          'group-hover:translate-x-2 group-hover:translate-y-2 transition-all',
        )}
      >
        {label}
      </span>
    </Tag>
  );
}
