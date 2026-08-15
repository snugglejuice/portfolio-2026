import cx from 'classnames';
import './styles.css';

interface QuestionProps {
  summary: string;
  text: string;
  color: 'green' | 'blue' | 'orange' | 'yellow';
}

export default function Question({ summary, text, color }: QuestionProps) {
  return (
    <details className={cx(`question`, 'hover:cursor-pointer')}>
      <summary
        className={cx(
          'font-secondary font-semibold text-[24px] leading-none',
          'flex gap-5 items-center justify-between',
          `bg-foreground p-4 border-2`,
          'relative z-10',
          {
            'hover:bg-green-brand': color === 'green',
            'hover:bg-yellow-brand': color === 'yellow',
            'hover:bg-blue-brand': color === 'blue',
            'hover:bg-orange-brand': color === 'orange',
          },
        )}
      >
        {summary}
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            y1="7"
            x2="14"
            y2="7"
            stroke="black"
            strokeWidth="2"
            className="question__illustration__line-1"
          />
          <line
            x1="7"
            y1="14"
            x2="7"
            stroke="black"
            strokeWidth="2"
            className="question__illustration__line-2"
          />
        </svg>
      </summary>
      <p className={cx('p-4 font-secondary text-[20px] border-2 border-t-0')}>
        {text}
      </p>
    </details>
  );
}
