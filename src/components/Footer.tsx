'use client';

import { useLang } from '@/contexts/LanguageContext';
import { t } from '@/data/translations';

export default function Footer() {
  const { lang } = useLang();
  const label = t[lang].footer;

  return (
    <footer style={{ background: '#000', position: 'relative', zIndex: 5 }}>
      <div className="max-w-[1290px] mx-auto px-6 py-7 text-center">
        <p className="text-xs text-white/40 tracking-wide leading-relaxed">
          © <em>2022 – 2026</em>{' '}
          <strong className="text-white/60">ConstruxionArq</strong> — {label}
          &nbsp;|&nbsp; Web design by{' '}
          <a
            href="https://prowebsolutionscr.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-accent transition-colors"
          >
            PROWEB Solutions
          </a>
          &nbsp;|&nbsp;
          <span>
            Last update: <strong className="text-white/60">v2.0.2</strong> · August 16, 2026
          </span>
        </p>
      </div>
    </footer>
  );
}