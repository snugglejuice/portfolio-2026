import classNames from 'classnames';
import cx from 'classnames';

interface ChooseMeCardProps {
  title: string;
  description: string;
  color: 'green' | 'yellow' | 'blue' | 'orange';
  className?: string;
}

export default function ChooseMeCard({
  title,
  description,
  color,
  className,
}: ChooseMeCardProps) {
  return (
    <div
      className={cx(
        `flex flex-col gap-4 bg-${color}-brand p-6 md:p-8 rounded-2xl border-2`,
        // Full height in the mobile deck so every card covers the last one.
        'h-full lg:h-max',
        className,
      )}
    >
      <h3 className="font-primary uppercase font-bold text-3xl md:text-4xl xl:text-[48px] leading-none">
        {title}
      </h3>
      <p className="font-secondary text-lg xl:text-[20px]">{description}</p>
    </div>
  );
}
