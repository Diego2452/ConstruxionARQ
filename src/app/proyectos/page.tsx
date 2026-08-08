'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLang } from '@/contexts/LanguageContext';
import { t } from '@/data/translations';
import { supabase, DBProject, getPrimaryImage, detectMediaType } from '@/lib/supabase';
import { CATEGORIES, CATEGORY_EN } from '@/data/categories';  // ← acá
const PAGE_SIZE = 6;

export default function ProyectosPage() {
  const { lang } = useLang();
  const tr = t[lang].proyectos;

  const [projects,  setProjects]  = useState<DBProject[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [category,  setCategory]  = useState('');   // '' = Todos
  const [page,      setPage]      = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    supabase.from('projects').select('*, project_images(*)')
      .order('year', { ascending: false })
      .then(({ data, error }) => {
        if (!isMounted) return;
        if (error) { setLoading(false); return; }
        const normalized = ((data ?? []) as DBProject[]).map(p => ({
          ...p,
          project_images: (p.project_images ?? []).sort(
            (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
          ),
        }));
        setProjects(normalized);
        setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  // Reset page on filter change
  useEffect(() => { setPage(1); }, [search, category]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('is-visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [page, search, category, loading]);

  // Categories that actually have projects
  const usedCategories = CATEGORIES.filter(c => projects.some(p => p.category === c));

  const filtered = projects.filter(p => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.location ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (p.architect ?? '').toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible    = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goToPage = (p: number) => {
    setPage(p);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div style={{ paddingTop: 200, minHeight: '100vh', background: '#151515' }}>

      {/* ── Header ── */}
      <div ref={topRef} className="max-w-[1290px] mx-auto px-6 lg:px-10 pt-14 pb-10">
        <p className="section-eyebrow">{tr.eyebrow}</p>
        <h1 className="reveal" style={{ fontFamily: "'Roboto Flex', Roboto, sans-serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 200, letterSpacing: '0.08em', color: '#fff', lineHeight: 1.2, marginTop: '0.4rem' }}>
          {tr.title}
        </h1>
        <div style={{ width: 56, height: 1.5, background: '#C11D2A', marginTop: '1rem' }} />
        <p className="reveal" style={{ marginTop: '1.2rem', color: 'rgba(255,255,255,0.65)', fontSize: 'clamp(0.85rem, 1.5vw, 1rem)', fontWeight: 300, lineHeight: 1.7, maxWidth: 560 }}>
          {tr.subtitle}
        </p>

        {/* ── Category filter ── */}
        {!loading && usedCategories.length > 0 && (
          <div style={{ marginTop: '2rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {/* Todos */}
            <button
              onClick={() => setCategory('')}
              style={{
                padding: '0.4rem 1rem',
                fontFamily: "'Roboto', sans-serif",
                fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                border: '1px solid',
                cursor: 'pointer',
                background: !category ? '#C11D2A' : 'none',
                borderColor: !category ? '#C11D2A' : 'rgba(255,255,255,0.2)',
                color: !category ? '#fff' : 'rgba(255,255,255,0.55)',
                transition: 'all 0.2s',
              }}
            >
              {lang === 'en' ? 'All' : 'Todos'}
            </button>

            {usedCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat === category ? '' : cat)}
                style={{
                  padding: '0.4rem 1rem',
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: '0.68rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                  border: '1px solid',
                  cursor: 'pointer',
                  background: category === cat ? 'rgba(193,29,42,0.15)' : 'none',
                  borderColor: category === cat ? '#C11D2A' : 'rgba(255,255,255,0.15)',
                  color: category === cat ? '#C11D2A' : 'rgba(255,255,255,0.55)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (category !== cat) { const el = e.currentTarget; el.style.borderColor = 'rgba(193,29,42,0.5)'; el.style.color = 'rgba(193,29,42,0.8)'; }}}
                onMouseLeave={e => { if (category !== cat) { const el = e.currentTarget; el.style.borderColor = 'rgba(255,255,255,0.15)'; el.style.color = 'rgba(255,255,255,0.55)'; }}}
              >
                {lang === 'en' ? (CATEGORY_EN[cat] ?? cat) : cat}
              </button>
            ))}
          </div>
        )}

        {/* ── Search + count ── */}
        <div style={{ marginTop: '1.4rem', display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
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
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' }}>
            {loading ? '…' : (search || category) ? tr.results(filtered.length) : tr.total(projects.length)}
          </span>
          {(search || category) && (
            <button
              onClick={() => { setSearch(''); setCategory(''); }}
              style={{ background: 'none', border: 'none', color: '#C11D2A', fontSize: '0.75rem', letterSpacing: '0.1em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <i className="bi bi-x-circle" /> {tr.clear}
            </button>
          )}
        </div>
      </div>

      {/* ── Category label when filtered ── */}
      {category && !loading && (
        <div className="max-w-[1290px] mx-auto px-6 lg:px-10 mb-2">
          <p style={{ fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C11D2A' }}>
            {lang === 'en' ? (CATEGORY_EN[category] ?? category) : category}
            <span style={{ color: 'rgba(255,255,255,0.3)', marginLeft: '0.5rem' }}>— {filtered.length} proyecto{filtered.length !== 1 ? 's' : ''}</span>
          </p>
        </div>
      )}

      {/* ── Grid ── */}
      <div className="max-w-[1290px] mx-auto px-6 lg:px-10 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ aspectRatio: '16/9', background: '#1a1a1a', animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))
        ) : visible.length > 0 ? (
          visible.map((p, i) => {
            const primary   = getPrimaryImage(p);
            const mediaType = primary?.media_type ?? detectMediaType(primary?.src ?? '');
            const isVideo   = mediaType === 'video';
            return (
              <Link key={p.slug} href={`/proyectos/${p.slug}/`}
                className="reveal project-card block"
                style={{ transitionDelay: `${(i % 3) * 0.07}s` }}
              >
                {isVideo ? (
                  <video src={primary?.src ?? ''} autoPlay muted loop style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : (
                  <img src={primary?.src ?? ''} alt={primary?.alt ?? p.title} loading={i < 6 ? 'eager' : 'lazy'} />
                )}
                <div className="project-card__overlay" />
                <div className="project-card__title">
                  {lang === 'en' && p.title_en ? p.title_en : p.title}
                </div>
                {p.year && (
                  <span style={{ position: 'absolute', top: '0.85rem', right: '0.85rem', fontSize: '0.62rem', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.45)' }}>
                    {p.year}
                  </span>
                )}
                {p.category && (
                  <span style={{ position: 'absolute', top: '0.85rem', left: '0.85rem', fontSize: '0.55rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', background: 'rgba(0,0,0,0.5)', padding: '0.15rem 0.4rem' }}>
                    {lang === 'en' ? (CATEGORY_EN[p.category] ?? p.category) : p.category}
                  </span>
                )}
              </Link>
            );
          })
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '5rem 0', textAlign: 'center' }}>
            <i className="bi bi-search" style={{ fontSize: '2.5rem', color: '#333', display: 'block', marginBottom: '1rem' }} />
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.9rem' }}>
              {tr.noResults} «{search || category}»
            </p>
            <button
              onClick={() => { setSearch(''); setCategory(''); }}
              style={{ marginTop: '1.2rem', background: 'none', border: '1px solid rgba(193,29,42,0.5)', color: '#C11D2A', padding: '0.5rem 1.4rem', cursor: 'pointer', fontSize: '0.75rem', letterSpacing: '0.14em' }}
            >
              {tr.clear}
            </button>
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="max-w-[1290px] mx-auto px-6 lg:px-10 pb-20 flex items-center justify-between flex-wrap gap-4">
          <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>
            Página {page} de {totalPages}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <button className="pagination-btn" onClick={() => goToPage(page - 1)} disabled={page === 1} aria-label={tr.prev}>
              <i className="bi bi-chevron-left" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} className={`pagination-btn ${n === page ? 'active' : ''}`} onClick={() => goToPage(n)}>{n}</button>
            ))}
            <button className="pagination-btn" onClick={() => goToPage(page + 1)} disabled={page === totalPages} aria-label={tr.next}>
              <i className="bi bi-chevron-right" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
