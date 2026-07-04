'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { projects } from '@/data/projects';
import { useLang } from '@/contexts/LanguageContext';
import { t } from '@/data/translations';

const PAGE_SIZE = 6;

export default function ProyectosPage() {
  const { lang } = useLang();
  const tr = t[lang].proyectos;
  const [search,  setSearch]  = useState('');
  const [page,    setPage]    = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  /* reset to page 1 whenever search changes */
  useEffect(() => setPage(1), [search]);

  /* scroll reveals */
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('is-visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [page, search]);

  /* filtered list */
  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.location ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (p.architect ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible    = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goToPage = (p: number) => {
    setPage(p);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div style={{ paddingTop: 200, minHeight: '100vh', background: '#151515' }}>

      {/* ── Header ── */}
      <div
        ref={topRef}
        className="max-w-[1290px] mx-auto px-6 lg:px-10 pt-14 pb-10"
      >
        <p className="section-eyebrow">{tr.eyebrow}</p>
        <h1 className="reveal" style={{
          fontFamily: "'Roboto Flex', Roboto, sans-serif",
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          fontWeight: 200, letterSpacing: '0.08em', color: '#fff',
          lineHeight: 1.2, marginTop: '0.4rem',
        }}>
          {tr.title}
        </h1>
        <div style={{ width: 56, height: 1.5, background: '#C11D2A', marginTop: '1rem' }} />
        <p className="reveal" style={{
          marginTop: '1.2rem',
          color: 'rgba(255,255,255,0.65)',
          fontSize: 'clamp(0.85rem, 1.5vw, 1rem)',
          fontWeight: 300,
          lineHeight: 1.7,
          maxWidth: 560,
        }}>
          {tr.subtitle}
        </p>

        {/* Search bar */}
        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
          <div className="search-wrapper">
            <i className="bi bi-search" />
            <input
              type="text"
              placeholder={tr.searchPlaceholder}
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label={tr.searchPlaceholder}
            />
          </div>

          {/* Result count */}
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' }}>
            {search ? tr.results(filtered.length) : tr.total(projects.length)}
          </span>

          {/* Clear */}
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                background: 'none', border: 'none', color: '#C11D2A',
                fontSize: '0.75rem', letterSpacing: '0.1em', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.35rem',
              }}
            >
              <i className="bi bi-x-circle" /> {tr.clear}
            </button>
          )}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-[1290px] mx-auto px-6 lg:px-10 pb-12
                      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visible.length > 0 ? (
          visible.map((p, i) => (
            <Link
              key={p.slug}
              href={`/proyectos/${p.slug}/`}
              className="reveal project-card block"
              style={{ transitionDelay: `${(i % 3) * 0.07}s` }}
            >
              <img
                src={p.thumbnail}
                alt={p.title}
                loading={i < 6 ? 'eager' : 'lazy'}
              />
              <div className="project-card__overlay" />
              <div className="project-card__title">{p.title}</div>
              {p.year && (
                <span style={{
                  position: 'absolute', top: '0.85rem', right: '0.85rem',
                  fontSize: '0.62rem', letterSpacing: '0.18em',
                  color: 'rgba(255,255,255,0.45)',
                  fontFamily: "'Roboto Flex', sans-serif",
                }}>
                  {p.year}
                </span>
              )}
            </Link>
          ))
        ) : (
          /* Empty state */
          <div style={{
            gridColumn: '1 / -1', padding: '5rem 0', textAlign: 'center',
          }}>
            <i className="bi bi-search" style={{ fontSize: '2.5rem', color: '#333', display: 'block', marginBottom: '1rem' }} />
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem', letterSpacing: '0.06em' }}>
              Sin resultados para «{search}»
            </p>
            <button
              onClick={() => setSearch('')}
              style={{
                marginTop: '1.2rem', background: 'none', border: '1px solid rgba(193,29,42,0.5)',
                color: '#C11D2A', padding: '0.5rem 1.4rem', cursor: 'pointer',
                fontSize: '0.75rem', letterSpacing: '0.14em',
              }}
            >
              Ver todos los proyectos
            </button>
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="max-w-[1290px] mx-auto px-6 lg:px-10 pb-20
                        flex items-center justify-between flex-wrap gap-4">

          {/* Page info */}
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>
            Página {page} de {totalPages}
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button
              className="pagination-btn"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              aria-label="Página anterior"
            >
              <i className="bi bi-chevron-left" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                className={`pagination-btn ${n === page ? 'active' : ''}`}
                onClick={() => goToPage(n)}
                aria-label={`Página ${n}`}
                aria-current={n === page ? 'page' : undefined}
              >
                {n}
              </button>
            ))}

            <button
              className="pagination-btn"
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              aria-label="Página siguiente"
            >
              <i className="bi bi-chevron-right" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
