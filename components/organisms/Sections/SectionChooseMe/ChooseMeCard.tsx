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
        `flex flex-col gap-4 bg-${color}-brand p-8 rounded-2xl border-2 h-max`,
        className,
      )}
    >
      <h3 className="font-primary uppercase font-bold text-[48px] leading-none">
        {title}
      </h3>
      <p className="font-secondary text-[20px]">{description}</p>
    </div>
  );
}
