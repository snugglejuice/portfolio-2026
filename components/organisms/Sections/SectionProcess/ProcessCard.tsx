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
      className={`bg-${color}-brand p-4 rounded-2xl border-2 flex flex-col gap-2`}
    >
      <div className="flex justify-between">
        <p className="font-primary font-bold uppercase text-[48px]">{number}</p>
        <p className="font-primary font-bold uppercase text-[48px]">{title}</p>
      </div>
      <ul className="flex flex-col gap-2">
        {benefits?.map((benefit, index) => (
          <li
            key={benefit}
            className={cx('font-secondary text-[20px]', {
              'pb-2 border-b': index !== benefits.length - 1,
            })}
          >
            {benefit}
          </li>
        ))}
      </ul>
    </article>
  );
}
