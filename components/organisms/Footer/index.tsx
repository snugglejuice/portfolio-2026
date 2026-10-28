import cx from 'classnames';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__contact grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div
          className={cx(
            'lg:col-start-1 lg:col-end-13',
            'bg-foreground p-6 md:p-10 rounded-3xl',
            'flex flex-col justify-between gap-10 md:gap-16',
          )}
        >
          <div className="flex flex-col gap-4">
            <h2 className="font-primary leading-none uppercase font-bold text-[44px] md:text-[64px]">
              Let’s talk
            </h2>
            <p className="font-secondary text-xl md:text-[24px]">
              I’m looking for a front-end developer role in
              <b> Zurich</b>. Hiring, or know a team that is? I’d love to hear
              from you.
            </p>
          </div>
          <dl>
            <dt className="font-secondary text-[20px] font-bold">Phone</dt>
            <dd className="font-secondary text-[20px]">
              <a href="tel:+41782249726" className="underline">
                +41 78 224 97 26
              </a>
            </dd>

            <dt className="font-secondary text-[20px] font-bold">E-mail</dt>
            <dd className="font-secondary text-[20px]">
              <a href="mailto:seminel.marion@gmail.com" className="underline">
                seminel.marion@gmail.com
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
        <div className="footer__actions lg:col-start-1 lg:col-end-13 flex flex-col gap-4">
          {/* <div className="bg-green-brand py-8 px-6 rounded-3xl flex flex-col justify-between gap-10 md:gap-16">
            <div className="flex flex-col gap-4">
              <h3 className="font-primary leading-none uppercase font-bold text-[32px]">
                Is your website pulling its weight?
              </h3>
              <p className="font-secondary text-xl md:text-[24px]">
                15 questions to find out whether your website has the impact
                it should on your business, spot what to improve and get
                concrete recommendations.
              </p>
            </div>
            <Button label="Start the quiz" fullWidth />
          </div> */}
          {/* <div className="bg-orange-brand py-8 px-6 rounded-3xl flex flex-col gap-4">
            <h3 className="font-primary leading-none uppercase font-bold text-[32px]">
              Newsletter
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Your e-mail"
                className="bg-foreground border-2 py-3 px-6 w-full min-w-0 font-secondary text-xl md:text-[24px]"
              />
              <Button label="Subscribe" />
            </div>
          </div> */}
          <div className="bg-foreground py-8 px-6 rounded-3xl flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
            <p className="font-secondary text-[20px]">© 2026 Marion Séminel</p>
            {/* <nav>
              <ul className="flex flex-wrap gap-x-7 gap-y-2">
                <li>
                  <a
                    href="/privacy-policy"
                    className="font-secondary text-[20px] underline cursor-pointer"
                  >
                    Privacy policy
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
            </nav> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
