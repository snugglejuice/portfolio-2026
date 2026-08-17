import Button from '@/components/atoms/button';
import cx from 'classnames';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__contact grid grid-cols-12 gap-4">
        <div
          className={cx(
            'col-start-1 col-end-5 bg-foreground p-10 rounded-3xl',
            'flex flex-col justify-between gap-16',
          )}
        >
          <div className="flex flex-col gap-4">
            <h2 className="font-primary leading-none uppercase font-bold text-[64px]">
              Collaborons ensemble
            </h2>
            <p className="font-secondary text-[24px]">
              Un projet en tête ? Je suis tout ouïe. Promis, vous avez
              <b> une réponse en moins de 24 heures.</b>
            </p>
          </div>
          <dl>
            <dt className="font-secondary text-[20px] font-bold">Téléphone</dt>
            <dd className="font-secondary text-[20px]">
              <a href="tel:+41782249726" className="underline">
                078 224 97 26
              </a>
            </dd>

            <dt className="font-secondary text-[20px] font-bold">E-mail</dt>
            <dd className="font-secondary text-[20px]">
              <a href="mailto:marion@seminel.ch" className="underline">
                marion@seminel.ch
              </a>
            </dd>

            <dt className="font-secondary text-[20px] font-bold">LinkedIn</dt>
            <dd className="font-secondary text-[20px]">
              <a
                href="https://www.linkedin.com/in/marion-s%C3%A9minel/"
                className="underline"
              >
                Marion Séminel
              </a>
            </dd>
          </dl>
        </div>
        <div className="footer__actions col-start-5 col-end-13 flex flex-col gap-4">
          <div className="bg-green-brand py-8 px-6 rounded-3xl flex flex-col justify-between gap-16">
            <div className="flex flex-col gap-4">
              <h3 className="font-primary leading-none uppercase font-bold text-[32px]">
                Votre site est-il utile ?
              </h3>
              <p className="font-secondary text-[24px]">
                15 questions pour découvrir si votre site a l’impact qu’il
                devrait sur votre business, découvrir les points d’amélioration
                et obtenir des recommandations concrètes.
              </p>
            </div>
            <Button label="Lancer le quizz" fullWidth />
          </div>
          <div className="bg-orange-brand py-8 px-6 rounded-3xl flex flex-col gap-4">
            <h3 className="font-primary leading-none uppercase font-bold text-[32px]">
              Newsletter
            </h3>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Votre e-mail"
                className="bg-foreground border-2 py-3 px-6 w-full font-secondary text-[24px]"
              />
              <Button label="S'abonner" />
            </div>
          </div>
          <div className="bg-foreground py-8 px-6 rounded-3xl flex justify-between items-center">
            <p className="font-secondary text-[20px]">© 2026 Marion Séminel</p>
            <nav>
              <ul className="flex gap-7">
                <li>
                  <a
                    href="/politique-de-confidentialité"
                    className="font-secondary text-[20px] underline cursor-pointer"
                  >
                    Politique de confidentialité
                  </a>
                </li>
                <li>
                  <a
                    href="#cookies"
                    className="font-secondary text-[20px] underline cursor-pointer"
                  >
                    Cookies
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
