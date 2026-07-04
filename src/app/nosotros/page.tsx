'use client';
import { useEffect } from 'react';

const BASE = 'https://construxionarq.com/wp-content/uploads';
const LOGO = 'https://construxionarq.com/wp-content/uploads/2023/03/construxionARQ-transparente-white-rebuild-AI.png';

const team = [
  {
    name:  'Arq. Alejandro Vargas',
    title: 'Director General – Primer Arquitecto',
    photo: `${BASE}/2023/03/5.-Alejandro-OnlyPicture-1-768x768.png`,
    icon:  'bi-person-badge',
    bio: [
      'Arquitecto Licenciado, Máster en Gerencia de Proyectos con énfasis en Construcción.',
      'Bilingüe Español – Inglés 100%. Registrado en CFIA # A-25A16.',
      'Dominio de Revit, AutoCad, SketchUp, Lumion, TwinMotion, MS Project y BIM.',
      'Experiencia desde 1995 en proyectos de estándar internacional. Se distingue por su liderazgo asertivo, gestión honesta y resultados de excelencia.',
    ],
  },
  {
    name:  'Juan Vargas Montes de Oca',
    title: 'Diseñador y Constructor Senior',
    photo: `${BASE}/2023/03/8.-TioJuan-Profile-768x769.png`,
    icon:  'bi-hammer',
    bio: [
      'Iniciando como Diseñador desde 1975 y Constructor desde 1980, con más de 120 construcciones a su haber.',
      'Pionero y fundador de Constructora Vargas Montes de Oca.',
      'Experto en sistemas constructivos y estructurales de toda índole, desde vivienda económica hasta edificios complejos.',
      'Referente en construcción tropical, sistemas en madera y gestión eficiente de recursos.',
    ],
  },
  {
    name:  'Karhol Rodriguez G.',
    title: 'Arquitecta – Diseñadora Senior',
    photo: `${BASE}/2023/03/6.-Karhol-Profile-768x769.png`,
    icon:  'bi-pencil-square',
    bio: [
      'Licenciada en Arquitectura por la UCR. Bilingüe Inglés – Español.',
      'Miembro activo CFIA carné: A-33837.',
      'AutoCad, SketchUp, Lumion, Unreal Engine, MS Project, BIM, Adobe.',
      'Experiencia desde 2010. Enfoque en diseño retador, presupuesto y control de obra con atención especial al detalle.',
    ],
  },
];

const services = [
  { icon: 'bi-rulers',            text: 'Arquitectura, diseño y construcción personalizados y orientados al detalle.' },
  { icon: 'bi-currency-dollar',   text: 'Servicios profesionales de alta calidad a precios justos y competitivos.' },
  { icon: 'bi-map',               text: 'Estudios, asesorías y diseños preliminares inclusive antes de la compra del terreno.' },
  { icon: 'bi-file-earmark-text', text: 'Planos y especificaciones técnicas altamente detallados para cada necesidad.' },
  { icon: 'bi-building-check',    text: 'Trámites y permisos ágiles ante todas las instituciones y municipalidades del país.' },
  { icon: 'bi-tools',             text: 'Servicios complementarios: avalúos, estudios técnicos de terrenos y más.' },
  { icon: 'bi-diagram-3',         text: 'Administración de proyectos e integración de todos los servicios de ingeniería.' },
];

export default function NosotrosPage() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('is-visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ paddingTop: 200, background: '#151515' }}>

      {/* ── 1. Company intro ── */}
      <section className="max-w-[1290px] mx-auto px-6 lg:px-10 pt-14 pb-20">

        {/* ── Page header ── */}
        <div style={{ marginBottom: '4rem' }}>
          <p className="section-eyebrow">Sobre Nosotros</p>
          <h1 className="reveal" style={{
            fontFamily: "'Roboto Flex', Roboto, sans-serif",
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 200, letterSpacing: '0.08em', color: '#fff',
            lineHeight: 1.2, marginTop: '0.4rem',
          }}>
            Diseñando Calidad,<br />Construyendo Confianza
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
            Desde 1990 construimos con vocación, honestidad y excelencia. Conocé al equipo que hace posible cada proyecto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

          {/* Left */}
          <div>
            <p className="section-eyebrow reveal">Quiénes Somos</p>
            <p className="reveal" style={{ fontSize: '1rem', lineHeight: 1.9, color: '#b8b8b8', fontWeight: 300, marginTop: '0.8rem', marginBottom: '2rem' }}>
              Desde 1990 logramos reconocimientos por la calidad, transparencia e integridad de nuestros
              miembros fundadores. Nuestros clientes nos distinguen por la excelente comunicación, liderazgo
              asertivo, adaptación a cada proyecto y, sobre todo, honestidad — por lo que confían 100% en el equipo.
            </p>
            <div className="reveal" style={{ overflow: 'hidden' }}>
              <img
                src={`${BASE}/2023/03/DiRoca-1.png`}
                alt="Proyecto DiRoca – ConstruxionArq"
                style={{ width: '100%', display: 'block', filter: 'brightness(0.88)' }}
              />
            </div>
          </div>

          {/* Right */}
          <div>
            <div className="reveal" style={{ marginBottom: '2rem' }}>
              <img src={LOGO} alt="ConstruxionArq" style={{ height: 48, width: 'auto' }} />
            </div>
            <p className="reveal" style={{ fontSize: '1rem', lineHeight: 1.9, color: '#b8b8b8', fontWeight: 300 }}>
              Antes <strong style={{ color: '#e8e8e8' }}>VARGAS MONTES DE OCA ARQUITECTOS</strong>, ahora
              con un nombre que expresa en una sola palabra nuestra pasión:{' '}
              <em style={{ color: '#C11D2A' }}>CONSTRUCCION ARQUITECTURA</em>.
            </p>
            <p className="reveal" style={{ fontSize: '1rem', lineHeight: 1.9, color: '#b8b8b8', fontWeight: 300, marginTop: '1.2rem' }}>
              Somos un <strong style={{ color: '#e8e8e8' }}>EQUIPO</strong> de arquitectos e ingenieros
              que trabajamos separados o unidos según la necesidad de cada cliente. El corazón del equipo
              es la familia Vargas Montes de Oca, con más de 30 años de experiencia nacional.
            </p>
            <p className="reveal" style={{ fontSize: '1rem', lineHeight: 1.9, color: '#b8b8b8', fontWeight: 300, marginTop: '1.2rem' }}>
              Desde 2016, el Arq. Alejandro Vargas transformó el concepto de «empresa» a «equipo»,
              reduciendo costos operativos sin sacrificar la calidad de los servicios.
            </p>
          </div>
        </div>
      </section>

      {/* ── 2. Services ── */}
      <section style={{ background: '#0d0d0d', padding: '5rem 0' }}>
        <div className="max-w-[1290px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            <div>
              <p className="section-eyebrow reveal">Diferenciadores</p>
              <h2 className="reveal" style={{
                fontFamily: "'Roboto Flex', sans-serif",
                fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                fontWeight: 200, letterSpacing: '0.06em',
                color: '#fff', lineHeight: 1.3, marginTop: '0.5rem',
              }}>
                Nos destacamos en:
              </h2>
            </div>

            <div className="md:col-span-2">
              {services.map((s, i) => (
                <div key={i} className="reveal" style={{
                  display: 'flex', alignItems: 'flex-start', gap: '1rem',
                  padding: '0.9rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)',
                  transitionDelay: `${i * 0.06}s`,
                }}>
                  <i className={`bi ${s.icon}`} style={{ fontSize: '1.1rem', color: '#C11D2A', marginTop: '0.2rem', flexShrink: 0 }} />
                  <p style={{ fontSize: '0.93rem', lineHeight: 1.75, color: '#b0b0b0', fontWeight: 300 }}>{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Team ── */}
      <section className="max-w-[1290px] mx-auto px-6 lg:px-10 py-20">
        <p className="section-eyebrow reveal">El Equipo</p>
        <h2 className="reveal" style={{
          fontFamily: "'Roboto Flex', sans-serif",
          fontSize: 'clamp(1.6rem, 3vw, 2.6rem)',
          fontWeight: 200, letterSpacing: '0.06em',
          color: '#fff', marginTop: '0.5rem', marginBottom: '3.5rem',
        }}>
          Nuestro Equipo
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {team.map((m, i) => (
            <div key={i} className="team-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div style={{ overflow: 'hidden', marginBottom: '1.4rem' }}>
                <img src={m.photo} alt={m.name} className="team-photo" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                <i className={`bi ${m.icon}`} style={{ color: '#C11D2A', fontSize: '1rem' }} />
                <h3 style={{ fontFamily: "'Roboto Flex', sans-serif", fontSize: '1.1rem', fontWeight: 400, color: '#fff' }}>
                  {m.name}
                </h3>
              </div>
              <p style={{ fontSize: '0.7rem', letterSpacing: '0.13em', textTransform: 'uppercase', color: '#C11D2A', marginBottom: '1rem' }}>
                {m.title}
              </p>
              {m.bio.map((para, j) => (
                <p key={j} style={{ fontSize: '0.87rem', lineHeight: 1.78, color: '#909090', fontWeight: 300, marginBottom: '0.5rem' }}>
                  {para}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. Clients ── */}
      <section style={{ background: '#0d0d0d', padding: '4rem 0' }}>
        <div className="max-w-[1290px] mx-auto px-6 lg:px-10">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
            <i className="bi bi-award reveal" style={{ fontSize: '1.6rem', color: '#C11D2A' }} />
            <p className="section-eyebrow reveal" style={{ marginBottom: 0 }}>Trayectoria</p>
          </div>
          <h2 className="reveal" style={{
            fontFamily: "'Roboto Flex', sans-serif",
            fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
            fontWeight: 200, letterSpacing: '0.08em', color: '#fff', marginBottom: '1rem',
          }}>
            Clientes y Aliados
          </h2>
          <p className="reveal" style={{ fontSize: '1rem', lineHeight: 1.8, color: '#7a7a7a', fontWeight: 300, maxWidth: 640 }}>
            Durante más de tres décadas hemos construido relaciones sólidas con clientes privados,
            empresas del sector construcción, instituciones educativas y organismos públicos en todo
            el territorio nacional. Cada proyecto es una nueva oportunidad de superar expectativas
            y dejar una huella de calidad duradera.
          </p>
        </div>
      </section>
    </div>
  );
}
