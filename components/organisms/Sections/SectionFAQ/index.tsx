import cx from 'classnames';

import './styles.css';
import Question from './Question';

export default function SectionFAQ() {
  return (
    <section className="section-faq">
      <div
        className={cx(
          'bg-foreground p-10 flex flex-col gap-4 rounded-3xl',
          'grid grid-cols-12 gap-5 items-start py-20 px-0',
        )}
      >
        <h2
          className={cx(
            'font-primary font-bold text-[64px] uppercase leading-none',
            'col-start-2 col-end-6',
          )}
        >
          Comme disait la maîtresse, il n’y a pas de questions idiotes
        </h2>
        <div
          className={cx(
            'col-start-7 col-end-12 relative',
            'flex flex-col gap-4',
          )}
        >
          <Question
            key="question-1"
            summary="Combien coûte un site web en Suisse ?"
            text="J’ai crée des sites web et des outils internes pour des
              entreprises dans des domaines varié : santé, finance, ERP mais mes
              chouchous reste les musées, les festivals, les créateurs et les
              entrepreneurs."
            color="blue"
          />
          <Question
            key="question-2"
            summary="Combien coûte un site web en Suisse ?"
            text="J’ai crée des sites web et des outils internes pour des
              entreprises dans des domaines varié : santé, finance, ERP mais mes
              chouchous reste les musées, les festivals, les créateurs et les
              entrepreneurs."
            color="green"
          />
          <Question
            key="question-3"
            summary="Combien coûte un site web en Suisse ?"
            text="J’ai crée des sites web et des outils internes pour des
              entreprises dans des domaines varié : santé, finance, ERP mais mes
              chouchous reste les musées, les festivals, les créateurs et les
              entrepreneurs."
            color="orange"
          />
          <Question
            key="question-4"
            summary="Combien coûte un site web en Suisse ?"
            text="J’ai crée des sites web et des outils internes pour des
              entreprises dans des domaines varié : santé, finance, ERP mais mes
              chouchous reste les musées, les festivals, les créateurs et les
              entrepreneurs."
            color="yellow"
          />
        </div>
      </div>
    </section>
  );
}
