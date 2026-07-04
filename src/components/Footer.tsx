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
          <a href="mailto:diegovargas087@gmail.com" className="underline hover:text-accent transition-colors">
            diegovargas087@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
}
