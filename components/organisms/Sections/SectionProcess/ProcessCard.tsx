import cx from 'classnames';

interface SectionProcessProps {
  number: string;
  title: string;
  benefits: string[];
  color: 'green' | 'yellow' | 'blue' | 'orange';
}

export default function SectionProcess({
  number,
  title,
  benefits,
  color,
}: SectionProcessProps) {
  return (
    <article
      className={`bg-${color}-brand p-3 lg:p-4 rounded-2xl border-2 flex flex-col gap-2`}
    >
      <div className="flex justify-between">
        <p className="font-primary font-bold uppercase text-3xl lg:text-[48px]">
          {number}
        </p>
        <p className="font-primary font-bold uppercase text-3xl lg:text-[48px]">
          {title}
        </p>
      </div>
      <ul className="flex flex-col gap-1 lg:gap-2">
        {benefits?.map((benefit, index) => (
          <li
            key={benefit}
            className={cx('font-secondary text-base lg:text-[20px]', {
              'pb-1 lg:pb-2 border-b': index !== benefits.length - 1,
            })}
          >
            {benefit}
          </li>
        ))}
      </ul>
    </article>
  );
}
