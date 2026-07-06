export type Lang = 'es' | 'en';

export const t = {
  es: {
    nav: {
      nosotros:  'Nosotros',
      proyectos: 'Proyectos',
      contactar: 'Contactar',
    },
    tagline: {
      line1: 'Diseñando Calidad',
      line2: 'Construyendo Confianza',
      since: 'Desde 1990',
    },
    footer: 'Todos los derechos reservados',

    // ── Homepage ─────────────────────────────────────
    home: {
      eyebrow:   'Arquitectura & Construcción',
      title:     'CONSTRUXIONARQ',
      subtitle:  'Diseñamos y construimos con vocación, honestidad y excelencia desde 1990.',
      scrollCta: 'Scroll down to read more',
      stats: {
        experience: 'Años de experiencia',
        builds:     'Construcciones',
        territory:  'Territorio nacional',
      },
      cards: {
        projects: { label: 'Proyectos',  sub: 'Ver portafolio'           },
        about:    { label: 'Nosotros',   sub: 'Conocé el equipo'         },
        contact:  { label: 'Contactar',  sub: 'Hablemos de tu proyecto'  },
      },
    },

    // ── Proyectos ────────────────────────────────────
    proyectos: {
      eyebrow:           'Portafolio',
      title:             'Nuestros Proyectos',
      subtitle:          'Más de tres décadas transformando espacios en Costa Rica. Explorá cada proyecto y conocé nuestra visión arquitectónica.',
      searchPlaceholder: 'Buscar proyectos…',
      results:           (n: number) => `${n} resultado${n !== 1 ? 's' : ''}`,
      total:             (n: number) => `${n} proyectos`,
      clear:             'Limpiar',
      noResults:         'Sin resultados para',
      noResultsSub:      'Intentá con otro término.',
      prev:              'Anterior',
      next:              'Siguiente',
    },

    // ── Proyecto [slug] ──────────────────────────────
    proyecto: {
      label:       'Proyecto',
      location:    'Ubicación',
      year:        'Año',
      pm:          'Project Manager',
      architect:   'Arquitecto',
      dimensions:  'Dimensiones',
      description: 'Descripción',
      gallery:     'Galería',
      back:        'Volver a Proyectos',
      notFound:    'Proyecto no encontrado.',
    },

    // ── Traducciones de proyectos individuales ───────
    projects: {
      'casa-d': {
        title: 'Casa No.D',
        description: 'Proyecto de vivienda residencial con una propuesta arquitectónica contemporánea que equilibra vistas amplias, integración al entorno y eficiencia espacial en cada nivel.',
      },
      'casa-c': {
        title: 'Casa C',
        description: 'Vivienda unifamiliar de diseño contemporáneo con énfasis en la integración entre espacios interiores y exteriores, acabados de alta calidad y propuesta volumétrica distintiva.',
      },
      'casa-b': {
        title: 'Casa B',
        description: 'Casa de diseño moderno con terraza panorámica y amplios espacios de convivencia. El proyecto combina renders de alta fidelidad con fotografías reales del proceso constructivo.',
      },
      'casa-a': {
        title: 'Casa A',
        description: 'Residencia unifamiliar con una propuesta volumétrica que integra modelos básicos y renders finales de alta definición, complementada con fotografías reales del proceso de construcción.',
      },
      'casa-parrita': {
        title: 'Casa Parrita',
        description: 'Casa costera con ventilación natural ubicada a un kilómetro del mar. Zona de alta humedad y calor. Se resuelve arquitectónicamente elevándola 80 cm del suelo e incorporando un elaborado diseño de cielos y aperturas especiales que enfrían los espacios sin equipos de aire acondicionado. Se logró un costo 15% menor al presupuestado.',
      },
      'complejo-de-apartamentos-diroca': {
        title: 'Complejo de Apartamentos DiRoca',
        description: 'Complejo habitacional de 9 apartamentos y una casa de habitación. El diseño escalonado permite que el proyecto tome la forma orgánica del terreno, procurando una intervención artificial mínima y generando una fachada dinámica.',
      },
      'condominio-escazu-01': {
        title: 'Condominio Escazú 01',
        description: 'Condominio contemporáneo en uno de los sectores más exclusivos de la Gran Área Metropolitana.',
      },
      'casa-salgado': {
        title: 'Casa Salgado',
        description: 'Residencia familiar diseñada con énfasis en privacidad y funcionalidad.',
      },
      'casa-sierra': {
        title: 'Casa Sierra',
        description: 'Diseño arquitectónico integrado al paisaje montañoso costarricense.',
      },
      'tiny-home': {
        title: 'Tiny Home',
        description: 'Vivienda compacta de alta eficiencia con diseño sostenible y materiales naturales.',
      },
      'tiny-office': {
        title: 'Tiny Office',
        description: 'Espacio de trabajo compacto diseñado para maximizar la productividad y el bienestar.',
      },
      'colegio-de-ingenieros-agronomos-ampliacion': {
        title: 'Colegio de Ingenieros Agrónomos (Ampliación)',
        description: 'Ampliación institucional diseñada para responder a las necesidades actuales del gremio.',
      },
      'casa-vargas': {
        title: 'Casa Vargas',
        description: 'Residencia familiar de diseño clásico-moderno, con amplios espacios sociales.',
      },
      'casa-giron-beckles': {
        title: 'Casa Girón Beckles',
        description: 'Proyecto residencial con fusión de estilos contemporáneo y tropical costarricense.',
      },
      'hotel-corobici': {
        title: 'Hotel Corobicí',
        description: 'Remodelación y modernización de las instalaciones del reconocido hotel capitalino.',
      },
      'casa-clara-muller': {
        title: 'Casa Clara Müller',
        description: 'Vivienda unifamiliar de estilo contemporáneo europeo adaptado al trópico.',
      },
      'escuela-panamericana-ii': {
        title: 'Escuela Panamericana II',
        description: 'Segunda etapa de construcción de la sede educativa, con enfoque en sostenibilidad.',
      },
      'casa-ibeth-castro': {
        title: 'Casa Ibeth Castro',
        description: 'Residencia diseñada con atención especial a los detalles de interiores y materialidad.',
      },
      'centro-juvenil-amigo': {
        title: 'Centro Juvenil Amigó',
        description: 'Diseño y construcción de espacio comunitario orientado al desarrollo de la juventud costarricense.',
      },
    },

    // ── Nosotros ─────────────────────────────────────
    nosotros: {
      eyebrow:       'Sobre Nosotros',
      title:         'Diseñando Calidad,\nConstruyendo Confianza',
      subtitle:      'Desde 1990 construimos con vocación, honestidad y excelencia. Conocé al equipo que hace posible cada proyecto.',
      whoEyebrow:    'Quiénes Somos',
      whoParagraph1: 'Desde 1990 logramos reconocimientos por la calidad, transparencia e integridad de nuestros miembros fundadores. Nuestros clientes nos distinguen por la excelente comunicación, liderazgo asertivo, adaptación a cada proyecto y, sobre todo, honestidad — por lo que confían 100% en el equipo.',
      whoTitle2:     'Nuestra Misión',
      whoParagraph2: 'Brindar soluciones arquitectónicas y constructivas de alta calidad, adaptadas a las necesidades y visión de cada cliente, con un enfoque en la excelencia técnica, la sostenibilidad y el uso eficiente de los recursos.',
      whoTitle3:     'Nuestra Visión',
      whoParagraph3: 'Ser reconocidos como una de las empresas líderes en diseño y construcción en Costa Rica, distinguiéndonos por la innovación, la calidad y el compromiso con nuestros clientes.',
      diffEyebrow:   'Diferenciadores',
      diffTitle:     'Por Qué Elegirnos',
      differentiators: [
        { icon: 'bi-award',        title: 'Más de 30 años',       desc: 'Décadas de experiencia en diseño y construcción a lo largo de todo el territorio nacional.' },
        { icon: 'bi-people',       title: 'Equipo especializado',  desc: 'Arquitectos, ingenieros y maestros de obra trabajando en perfecta sincronía en cada proyecto.' },
        { icon: 'bi-shield-check', title: 'Garantía total',        desc: 'Nos comprometemos con la calidad y la entrega en tiempo — tu inversión está protegida.' },
        { icon: 'bi-geo-alt',      title: 'Cobertura nacional',    desc: 'Presencia en todo Costa Rica, con proyectos ejecutados en distintas regiones del país.' },
      ],
      teamEyebrow: 'El Equipo',
      teamTitle:   'Las Personas Detrás de Cada Proyecto',
      team: [
        { name: 'Manuel Chavarria',    role: 'Fundador & Project Manager', bio: 'Con más de 30 años de experiencia en el sector, Manuel lidera la empresa con una visión clara: construir con integridad y entregar resultados que superen las expectativas.' },
        { name: 'Karhol Rodriguez G.', role: 'Arquitecto Principal',       bio: 'Especialista en diseño residencial y comercial, Karhol combina funcionalidad y estética en cada propuesta, asegurando que los espacios sean bellos, eficientes y duraderos.' },
      ],
      services: [
        { icon: 'bi-house-door', title: 'Diseño Residencial',   desc: 'Casas y residencias diseñadas a la medida de cada familia.'                          },
        { icon: 'bi-building',   title: 'Proyectos Comerciales', desc: 'Edificios y locales que potencian tu negocio.'                                       },
        { icon: 'bi-rulers',     title: 'Planos y Permisos',     desc: 'Gestión completa de diseño técnico y trámites municipales.'                           },
        { icon: 'bi-hammer',     title: 'Construcción General',  desc: 'Obra gris, acabados y supervisión de proyecto.'                                       },
        { icon: 'bi-tree',       title: 'Diseño de Exteriores',  desc: 'Jardines, terrazas y espacios al aire libre.'                                         },
        { icon: 'bi-recycle',    title: 'Remodelaciones',        desc: 'Transformamos espacios existentes con nuevos acabados y distribuciones.'              },
      ],
      servicesEyebrow:    'Servicios',
      servicesTitle:      'Lo Que Ofrecemos',
      trajectoryEyebrow:  'Trayectoria',
      trajectoryTitle:    'Tres Décadas Construyendo Costa Rica',
      trajectoryText:     'Desde nuestros inicios en 1990, hemos completado más de 120 proyectos a lo largo del territorio nacional. Cada construcción es un testimonio de nuestro compromiso con la calidad, la puntualidad y la satisfacción del cliente.',
      stats: [
        { num: '+30',  label: 'Años en el mercado'     },
        { num: '+120', label: 'Proyectos completados'  },
        { num: '100%', label: 'Cobertura nacional'     },
        { num: '+50',  label: 'Clientes satisfechos'   },
      ],
    },

    // ── Contactar ────────────────────────────────────
    contactar: {
      eyebrow:  'Contacto',
      title:    'Hablemos de tu Proyecto',
      subtitle: 'Estamos listos para escuchar tu visión y convertirla en realidad. Escríbenos o llámanos — te respondemos a la brevedad.',
      cards: [
        { icon: 'bi-whatsapp',  title: 'WhatsApp',           value: '+506 8303-3040',          href: 'https://wa.me/50683033040'                                    },
        { icon: 'bi-envelope',  title: 'Correo Electrónico', value: 'info@construxionarq.com', href: 'mailto:info@construxionarq.com'                               },
        { icon: 'bi-instagram', title: 'Instagram',          value: '@construxionarq',         href: 'https://www.instagram.com/construxionarq/'                    },
        { icon: 'bi-facebook',  title: 'Facebook',           value: 'ConstruxionArq',          href: 'https://www.facebook.com/profile.php?id=100088697271627'      },
      ],
      mapTitle:   'Zona de Cobertura',
      mapSubtitle:'Operamos en todo el territorio costarricense.',
      cta:        '¡Escribinos por WhatsApp!',
    },
  },

  // ════════════════════════════════════════════════════
  en: {
    nav: {
      nosotros:  'About',
      proyectos: 'Projects',
      contactar: 'Contact',
    },
    tagline: {
      line1: 'Designing Quality',
      line2: 'Building Trust',
      since: 'Since 1990',
    },
    footer: 'All rights reserved',

    // ── Homepage ─────────────────────────────────────
    home: {
      eyebrow:   'Architecture & Construction',
      title:     'CONSTRUXIONARQ',
      subtitle:  'We design and build with vocation, honesty and excellence since 1990.',
      scrollCta: 'Scroll down to read more',
      stats: {
        experience: 'Years of experience',
        builds:     'Constructions',
        territory:  'National territory',
      },
      cards: {
        projects: { label: 'Projects',  sub: 'View portfolio'                },
        about:    { label: 'About Us',  sub: 'Meet the team'                 },
        contact:  { label: 'Contact',   sub: "Let's talk about your project" },
      },
    },

    // ── Proyectos ────────────────────────────────────
    proyectos: {
      eyebrow:           'Portfolio',
      title:             'Our Projects',
      subtitle:          'Over three decades transforming spaces in Costa Rica. Explore each project and discover our architectural vision.',
      searchPlaceholder: 'Search projects…',
      results:           (n: number) => `${n} result${n !== 1 ? 's' : ''}`,
      total:             (n: number) => `${n} projects`,
      clear:             'Clear',
      noResults:         'No results for',
      noResultsSub:      'Try a different term.',
      prev:              'Previous',
      next:              'Next',
    },

    // ── Proyecto [slug] ──────────────────────────────
    proyecto: {
      label:       'Project',
      location:    'Location',
      year:        'Year',
      pm:          'Project Manager',
      architect:   'Architect',
      dimensions:  'Dimensions',
      description: 'Description',
      gallery:     'Gallery',
      back:        'Back to Projects',
      notFound:    'Project not found.',
    },

    // ── Traducciones de proyectos individuales ───────
    projects: {
      'casa-d': {
        title: 'Casa No.D',
        description: 'Residential housing project with a contemporary architectural proposal that balances wide views, environmental integration and spatial efficiency at every level.',
      },
      'casa-c': {
        title: 'Casa C',
        description: 'Single-family home of contemporary design with emphasis on the integration between interior and exterior spaces, high-quality finishes and a distinctive volumetric proposal.',
      },
      'casa-b': {
        title: 'Casa B',
        description: 'Modern design house with panoramic terrace and ample living spaces. The project combines high-fidelity renders with real photographs of the construction process.',
      },
      'casa-a': {
        title: 'Casa A',
        description: 'Single-family residence with a volumetric proposal that integrates basic models and high-definition final renders, complemented by real photographs of the construction process.',
      },
      'casa-parrita': {
        title: 'Casa Parrita',
        description: 'Coastal house with natural ventilation, located one kilometer from the sea. High humidity and heat zone. Solved architecturally by elevating 80 cm from the ground and incorporating an elaborate ceiling and opening design that cools spaces without air conditioning. Achieved a cost 15% below budget.',
      },
      'complejo-de-apartamentos-diroca': {
        title: 'DiRoca Apartment Complex',
        description: 'Residential complex of 9 apartments and one house. The stepped design allows the project to follow the organic shape of the terrain, minimizing artificial intervention and resulting in a dynamic facade.',
      },
      'condominio-escazu-01': {
        title: 'Escazú Condominium 01',
        description: 'Contemporary condominium in one of the most exclusive sectors of the Greater Metropolitan Area.',
      },
      'casa-salgado': {
        title: 'Casa Salgado',
        description: 'Family residence designed with emphasis on privacy and functionality.',
      },
      'casa-sierra': {
        title: 'Casa Sierra',
        description: 'Architectural design integrated into the Costa Rican mountain landscape.',
      },
      'tiny-home': {
        title: 'Tiny Home',
        description: 'High-efficiency compact dwelling with sustainable design and natural materials.',
      },
      'tiny-office': {
        title: 'Tiny Office',
        description: 'Compact workspace designed to maximize productivity and well-being.',
      },
      'colegio-de-ingenieros-agronomos-ampliacion': {
        title: 'Agronomists Engineers College (Expansion)',
        description: 'Institutional expansion designed to meet the current needs of the professional association.',
      },
      'casa-vargas': {
        title: 'Casa Vargas',
        description: 'Family residence with classic-modern design and ample social spaces.',
      },
      'casa-giron-beckles': {
        title: 'Casa Girón Beckles',
        description: 'Residential project with a fusion of contemporary and tropical Costa Rican styles.',
      },
      'hotel-corobici': {
        title: 'Hotel Corobicí',
        description: 'Remodeling and modernization of the facilities of the renowned capital hotel.',
      },
      'casa-clara-muller': {
        title: 'Casa Clara Müller',
        description: 'Single-family home with contemporary European style adapted to the tropics.',
      },
      'escuela-panamericana-ii': {
        title: 'Panamerican School II',
        description: 'Second construction stage of the educational institution, with a focus on sustainability.',
      },
      'casa-ibeth-castro': {
        title: 'Casa Ibeth Castro',
        description: 'Residence designed with special attention to interior details and materiality.',
      },
      'centro-juvenil-amigo': {
        title: 'Centro Juvenil Amigó',
        description: 'Design and construction of a community space oriented toward the development of Costa Rican youth.',
      },
    },

    // ── Nosotros ─────────────────────────────────────
    nosotros: {
      eyebrow:       'About Us',
      title:         'Designing Quality,\nBuilding Trust',
      subtitle:      'Since 1990 we build with vocation, honesty and excellence. Meet the team behind every project.',
      whoEyebrow:    'Who We Are',
      whoParagraph1: 'Since 1990 we have earned recognition for the quality, transparency and integrity of our founding members. Our clients distinguish us for excellent communication, assertive leadership, adaptation to each project and, above all, honesty — which is why they trust the team 100%.',
      whoTitle2:     'Our Mission',
      whoParagraph2: 'To provide high-quality architectural and construction solutions, tailored to the needs and vision of each client, with a focus on technical excellence, sustainability and efficient use of resources.',
      whoTitle3:     'Our Vision',
      whoParagraph3: 'To be recognized as one of the leading design and construction companies in Costa Rica, distinguished by innovation, quality and commitment to our clients.',
      diffEyebrow:   'Why Us',
      diffTitle:     'Why Choose Us',
      differentiators: [
        { icon: 'bi-award',        title: 'Over 30 years',       desc: 'Decades of experience in design and construction across the entire national territory.'   },
        { icon: 'bi-people',       title: 'Specialized team',    desc: 'Architects, engineers and site masters working in perfect sync on every project.'         },
        { icon: 'bi-shield-check', title: 'Full guarantee',      desc: 'We commit to quality and on-time delivery — your investment is protected.'               },
        { icon: 'bi-geo-alt',      title: 'National coverage',   desc: 'Present throughout Costa Rica, with projects executed in different regions of the country.' },
      ],
      teamEyebrow: 'The Team',
      teamTitle:   'The People Behind Every Project',
      team: [
        { name: 'Manuel Chavarria',    role: 'Founder & Project Manager', bio: 'With over 30 years of industry experience, Manuel leads the company with a clear vision: build with integrity and deliver results that exceed expectations.' },
        { name: 'Karhol Rodriguez G.', role: 'Lead Architect',            bio: 'Specialist in residential and commercial design, Karhol combines functionality and aesthetics in every proposal, ensuring spaces are beautiful, efficient and durable.' },
      ],
      services: [
        { icon: 'bi-house-door', title: 'Residential Design',   desc: 'Houses and residences tailored to each family.'                           },
        { icon: 'bi-building',   title: 'Commercial Projects',   desc: 'Buildings and spaces that empower your business.'                         },
        { icon: 'bi-rulers',     title: 'Plans & Permits',       desc: 'Full management of technical design and municipal procedures.'             },
        { icon: 'bi-hammer',     title: 'General Construction',  desc: 'Structural work, finishes and project supervision.'                       },
        { icon: 'bi-tree',       title: 'Exterior Design',       desc: 'Gardens, terraces and outdoor spaces.'                                    },
        { icon: 'bi-recycle',    title: 'Remodeling',            desc: 'We transform existing spaces with new finishes and layouts.'              },
      ],
      servicesEyebrow:    'Services',
      servicesTitle:      'What We Offer',
      trajectoryEyebrow:  'Track Record',
      trajectoryTitle:    'Three Decades Building Costa Rica',
      trajectoryText:     'Since our beginnings in 1990, we have completed over 120 projects across the national territory. Each construction is a testament to our commitment to quality, punctuality and client satisfaction.',
      stats: [
        { num: '+30',  label: 'Years in the market'    },
        { num: '+120', label: 'Completed projects'     },
        { num: '100%', label: 'National coverage'      },
        { num: '+50',  label: 'Satisfied clients'      },
      ],
    },

    // ── Contactar ────────────────────────────────────
    contactar: {
      eyebrow:  'Contact',
      title:    "Let's Talk About Your Project",
      subtitle: "We're ready to listen to your vision and turn it into reality. Write or call us — we'll get back to you promptly.",
      cards: [
        { icon: 'bi-whatsapp',  title: 'WhatsApp',  value: '+506 8303-3040',          href: 'https://wa.me/50683033040'                                   },
        { icon: 'bi-envelope',  title: 'Email',     value: 'info@construxionarq.com', href: 'mailto:info@construxionarq.com'                              },
        { icon: 'bi-instagram', title: 'Instagram', value: '@construxionarq',         href: 'https://www.instagram.com/construxionarq/'                   },
        { icon: 'bi-facebook',  title: 'Facebook',  value: 'ConstruxionArq',          href: 'https://www.facebook.com/profile.php?id=100088697271627'     },
      ],
      mapTitle:   'Coverage Area',
      mapSubtitle:'We operate throughout Costa Rican territory.',
      cta:        'Message us on WhatsApp!',
    },
  },
} as const;