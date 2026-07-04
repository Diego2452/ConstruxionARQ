export interface ProjectImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface Project {
  slug: string;
  title: string;
  thumbnail: string;
  location?: string;
  manager?: string;
  architect?: string;
  dimensions?: string;
  description?: string;
  images: ProjectImage[];
  category?: string;
  year?: string;
}

const BASE = 'https://construxionarq.com/wp-content/uploads';

export const projects: Project[] = [
  // ── PAGE 1 ──────────────────────────────────────────────
  {
    slug: 'casa-d',
    title: 'Casa No.D',
    thumbnail: `${BASE}/2024/02/RENDERS-CASA-D_Photo-5-768x432.jpg`,
    location: 'Costa Rica',
    year: '2024',
    description: 'Proyecto de vivienda residencial con una propuesta arquitectónica contemporánea que equilibra vistas amplias, integración al entorno y eficiencia espacial en cada nivel.',
    images: [
      { src: `${BASE}/2024/02/RENDERS-CASA-D_Photo-5-scaled.jpg`,  alt: 'Casa D – vista principal',           caption: 'Fachada Principal'        },
      { src: `${BASE}/2024/02/RENDERS-CASA-D_Photo-9-scaled.jpg`,  alt: 'Casa D – vista lejana 1',            caption: 'Vista Lejana'              },
      { src: `${BASE}/2024/02/RENDERS-CASA-D_Photo-7-scaled.jpg`,  alt: 'Casa D – render exterior 2',         caption: 'Exterior 2'               },
      { src: `${BASE}/2024/02/RENDERS-CASA-D_Photo-3-scaled.jpg`,  alt: 'Casa D – render exterior 3',         caption: 'Exterior 3'               },
      { src: `${BASE}/2024/02/RENDERS-CASA-D_Photo-2-scaled.jpg`,  alt: 'Casa D – render exterior 4',         caption: 'Exterior 4'               },
      { src: `${BASE}/2024/02/RENDERS-CASA-D_Photo-1-scaled.jpg`,  alt: 'Casa D – render exterior 5',         caption: 'Exterior 5'               },
      { src: `${BASE}/2024/02/RENDERS-CASA-D_Photo-10-scaled.jpg`, alt: 'Casa D – vista cercana 1',           caption: 'Vista de Cerca 1'         },
      { src: `${BASE}/2024/02/RENDERS-CASA-D_Photo-8-scaled.jpg`,  alt: 'Casa D – vista cercana 2',           caption: 'Vista de Cerca 2'         },
      { src: `${BASE}/2024/02/RENDERS-CASA-D_Photo-6-scaled.jpg`,  alt: 'Casa D – vista cercana 3',           caption: 'Vista de Cerca 3'         },
      { src: `${BASE}/2024/02/RENDERS-CASA-D_Photo-4-scaled.jpg`,  alt: 'Casa D – vista cercana 4',           caption: 'Vista de Cerca 4'         },
    ],
  },
  {
    slug: 'casa-c',
    title: 'Casa C',
    thumbnail: `${BASE}/2024/02/RENDER-CASA-C_Photo-5-768x432.jpg`,
    location: 'Costa Rica',
    year: '2024',
    description: 'Vivienda unifamiliar de diseño contemporáneo con énfasis en la integración entre espacios interiores y exteriores, acabados de alta calidad y propuesta volumétrica distintiva.',
    images: [
      { src: `${BASE}/2024/02/RENDER-CASA-C_Photo-5-scaled.jpg`,  alt: 'Casa C – fachada principal',    caption: 'Fachada'               },
      { src: `${BASE}/2024/02/RENDER-CASA-C_Photo-4-scaled.jpg`,  alt: 'Casa C – render día 1',          caption: 'Render Diurno 1'       },
      { src: `${BASE}/2024/02/RENDER-CASA-C_Photo-1-scaled.jpg`,  alt: 'Casa C – render día 2',          caption: 'Render Diurno 2'       },
      { src: `${BASE}/2024/02/RENDER-CASA-C_Photo-2-scaled.jpg`,  alt: 'Casa C – render día 3',          caption: 'Render Diurno 3'       },
      { src: `${BASE}/2024/02/RENDER-CASA-C_Photo-3-scaled.jpg`,  alt: 'Casa C – render día 4',          caption: 'Render Diurno 4'       },
      { src: `${BASE}/2024/02/RENDER-CASA-C_Photo-7-scaled.jpg`,  alt: 'Casa C – render tarde 1',        caption: 'Render Vespertino 1'   },
      { src: `${BASE}/2024/02/RENDER-CASA-C_Photo-6-scaled.jpg`,  alt: 'Casa C – render tarde 2',        caption: 'Render Vespertino 2'   },
      { src: `${BASE}/2024/02/render_Photo-7-scaled.jpg`,          alt: 'Casa C – render tarde 3',        caption: 'Render Vespertino 3'   },
      { src: `${BASE}/2024/02/render_Photo-6-scaled.jpg`,          alt: 'Casa C – render tarde 4',        caption: 'Render Vespertino 4'   },
      { src: `${BASE}/2024/02/render_Photo-5-scaled.jpg`,          alt: 'Casa C – render tarde 5',        caption: 'Render Vespertino 5'   },
      { src: `${BASE}/2024/02/IMG-20200616-WA0123.jpg`,            alt: 'Casa C – construcción 1',        caption: 'Construcción 1'        },
      { src: `${BASE}/2024/02/IMG-20200616-WA0124.jpg`,            alt: 'Casa C – construcción 2',        caption: 'Construcción 2'        },
      { src: `${BASE}/2024/02/IMG-20200616-WA0122.jpg`,            alt: 'Casa C – construcción 3',        caption: 'Construcción 3'        },
    ],
  },
  {
    slug: 'casa-b',
    title: 'Casa B',
    thumbnail: `${BASE}/2024/02/renders-casa-b-2_Photo-1-768x432.jpg`,
    location: 'Costa Rica',
    year: '2024',
    description: 'Casa de diseño moderno con terraza panorámica y amplios espacios de convivencia. El proyecto combina renders de alta fidelidad con fotografías reales del proceso constructivo.',
    images: [
      { src: `${BASE}/2024/02/renders-casa-b-2_Photo-1-scaled.jpg`,      alt: 'Casa B – fachada principal',  caption: 'Fachada'               },
      { src: `${BASE}/2024/02/render-casa-b_Photo-5-scaled.jpg`,          alt: 'Casa B – render final 1',     caption: 'Render Final 1'        },
      { src: `${BASE}/2024/02/render-casa-b_Photo-2-scaled.jpg`,          alt: 'Casa B – render final 2',     caption: 'Render Final 2'        },
      { src: `${BASE}/2024/02/renders-casa-b-2_Photo-6-scaled.jpg`,       alt: 'Casa B – render final 3',     caption: 'Render Final 3'        },
      { src: `${BASE}/2024/02/renders-casa-b-2_Photo-5-scaled.jpg`,       alt: 'Casa B – render final 4',     caption: 'Render Final 4'        },
      { src: `${BASE}/2024/02/renders-casa-b-2_Photo-2-scaled.jpg`,       alt: 'Casa B – render final 5',     caption: 'Render Final 5'        },
      { src: `${BASE}/2024/02/render-casa-b_Photo-4-scaled.jpg`,          alt: 'Casa B – terraza 1',          caption: 'Terraza 1'             },
      { src: `${BASE}/2024/02/renders-casa-b-2_Photo-8-scaled.jpg`,       alt: 'Casa B – terraza 2',          caption: 'Terraza 2'             },
      { src: `${BASE}/2024/02/renders-casa-b-2_Photo-7-scaled.jpg`,       alt: 'Casa B – terraza 3',          caption: 'Terraza 3'             },
      { src: `${BASE}/2024/02/renders-casa-b-2_Photo-4-scaled.jpg`,       alt: 'Casa B – terraza 4',          caption: 'Terraza 4'             },
      { src: `${BASE}/2024/02/renders-casa-b-2_Photo-3-scaled.jpg`,       alt: 'Casa B – terraza 5',          caption: 'Terraza 5'             },
      { src: `${BASE}/2024/02/IMG-20200616-WA0088-1.jpg`,                 alt: 'Casa B – construcción 1',     caption: 'Construcción 1'        },
      { src: `${BASE}/2024/02/IMG-20200616-WA0087-1.jpg`,                 alt: 'Casa B – construcción 2',     caption: 'Construcción 2'        },
      { src: `${BASE}/2024/02/IMG-20200616-WA0086-1.jpg`,                 alt: 'Casa B – construcción 3',     caption: 'Construcción 3'        },
    ],
  },
  {
    slug: 'casa-a',
    title: 'Casa A',
    thumbnail: `${BASE}/2024/02/proyecto-1-casa-corregidas_4-Photo-768x432.jpg`,
    location: 'Costa Rica',
    year: '2024',
    description: 'Residencia unifamiliar con una propuesta volumétrica que integra modelos básicos y renders finales de alta definición, complementada con fotografías reales del proceso de construcción.',
    images: [
      { src: `${BASE}/2024/02/proyecto-1-casa-corregidas_4-Photo-scaled.jpg`,   alt: 'Casa A – render principal',    caption: 'Render Principal'      },
      { src: `${BASE}/2024/02/proyecto-1-casa-c-oscuro_2-Photo-scaled.jpg`,     alt: 'Casa A – render final 1',      caption: 'Render Final 1'        },
      { src: `${BASE}/2024/02/proyecto-1-casa-c-oscuro_4-Photo-scaled.jpg`,     alt: 'Casa A – render final 2',      caption: 'Render Final 2'        },
      { src: `${BASE}/2024/02/proyecto-1-casa-corregidas_7-Photo-scaled.jpg`,   alt: 'Casa A – render final 3',      caption: 'Render Final 3'        },
      { src: `${BASE}/2024/02/proyecto-1-casa-corregidas_1-Photo-scaled.jpg`,   alt: 'Casa A – render final 4',      caption: 'Render Final 4'        },
      { src: `${BASE}/2024/02/proyecto-1-casa-corregidas_6-Photo-scaled.jpg`,   alt: 'Casa A – modelo básico 1',     caption: 'Modelo Básico 1'       },
      { src: `${BASE}/2024/02/proyecto-1-casa-corregidas_5-Photo-scaled.jpg`,   alt: 'Casa A – modelo básico 2',     caption: 'Modelo Básico 2'       },
      { src: `${BASE}/2024/02/26902927072_6c84231dd0_o-scaled.jpg`,             alt: 'Casa A – construcción 1',      caption: 'Construcción 1'        },
      { src: `${BASE}/2024/02/26094533726_aa659f2d3a_o-scaled.jpg`,             alt: 'Casa A – construcción 2',      caption: 'Construcción 2'        },
      { src: `${BASE}/2024/02/26723372520_798310634b_o-scaled.jpg`,             alt: 'Casa A – construcción 3',      caption: 'Construcción 3'        },
    ],
  },
  {
    slug: 'casa-parrita',
    title: 'Casa Parrita',
    thumbnail: `${BASE}/2023/03/Casa-Parrita-1-768x384.png`,
    location: 'Parrita, Puntarenas',
    architect: 'Juan Vargas Montes de Oca',
    images: [
      { src: `${BASE}/2023/03/Casa-Parrita-1.png`, alt: 'Casa Parrita – exterior' },
      { src: `${BASE}/2023/03/Casa-Parrita-2.png`, alt: 'Casa Parrita – detalles' },
    ],
    description: 'Residencia tropical adaptada al clima costero del Pacífico Central costarricense.',
    year: '2023',
  },
  {
    slug: 'complejo-de-apartamentos-diroca',
    title: 'Complejo de Apartamentos DiRoca',
    thumbnail: `${BASE}/2020/08/DiRoca-1-768x384.png`,
    location: 'San Antonio de Escazú, San José, Costa Rica',
    manager: 'Mario Chavarria',
    architect: 'Karhol Rodriguez G.',
    dimensions: '1,100 Metros Cuadrados',
    year: '2020',
    description:
      'Complejo habitacional de 9 apartamentos y una casa de habitación. El diseño escalonado permite que el proyecto tome la forma orgánica del terreno, procurando una intervención artificial mínima en centímetros y como resultado da una fachada dinámica.',
    images: [
      { src: `${BASE}/2020/08/DiRoca-1.png`,   alt: 'DiRoca – fachada principal', caption: 'Fachada'        },
      { src: `${BASE}/2020/08/DiRoca-Map.png`,  alt: 'DiRoca – planos',            caption: 'Planos'         },
      { src: `${BASE}/2023/03/DiRoca-4.png`,   alt: 'DiRoca – cocina',            caption: 'Cocina'         },
      { src: `${BASE}/2023/03/DiRoca-1.png`,   alt: 'DiRoca – exterior',          caption: 'Exterior'       },
      { src: `${BASE}/2023/03/DiRoca-2.png`,   alt: 'DiRoca – habitación',        caption: 'Habitación'     },
      { src: `${BASE}/2023/03/DiRoca-3.png`,   alt: 'DiRoca – jardín interno',    caption: 'Jardín Interno' },
    ],
  },

  // ── PAGE 2 ──────────────────────────────────────────────
  {
    slug: 'condominio-escazu-01',
    title: 'Condominio Escazú 01',
    thumbnail: `${BASE}/2023/03/DiRoca-1.png`,
    location: 'Escazú, San José',
    architect: 'Arq. Alejandro Vargas',
    images: [{ src: `${BASE}/2023/03/DiRoca-1.png`, alt: 'Condominio Escazú' }],
    description: 'Condominio contemporáneo en uno de los sectores más exclusivos de la Gran Área Metropolitana.',
    year: '2023',
  },
  {
    slug: 'casa-salgado',
    title: 'Casa Salgado',
    thumbnail: `${BASE}/2023/03/Casa-Parrita-1.png`,
    location: 'Costa Rica',
    architect: 'Karhol Rodriguez G.',
    images: [{ src: `${BASE}/2023/03/Casa-Parrita-1.png`, alt: 'Casa Salgado' }],
    description: 'Residencia familiar diseñada con énfasis en privacidad y funcionalidad.',
    year: '2023',
  },
  {
    slug: 'casa-sierra',
    title: 'Casa Sierra',
    thumbnail: `${BASE}/2024/02/RENDERS-CASA-D_Photo-5-768x432.jpg`,
    location: 'Costa Rica',
    architect: 'Arq. Alejandro Vargas',
    images: [{ src: `${BASE}/2024/02/RENDERS-CASA-D_Photo-5.jpg`, alt: 'Casa Sierra' }],
    description: 'Diseño arquitectónico integrado al paisaje montañoso costarricense.',
    year: '2023',
  },
  {
    slug: 'tiny-home',
    title: 'Tiny Home',
    thumbnail: `${BASE}/2024/02/RENDER-CASA-C_Photo-5-768x432.jpg`,
    location: 'Costa Rica',
    architect: 'Karhol Rodriguez G.',
    images: [{ src: `${BASE}/2024/02/RENDER-CASA-C_Photo-5.jpg`, alt: 'Tiny Home' }],
    description: 'Vivienda compacta de alta eficiencia con diseño sostenible y materiales naturales.',
    year: '2023',
  },
  {
    slug: 'tiny-office',
    title: 'Tiny Office',
    thumbnail: `${BASE}/2024/02/renders-casa-b-2_Photo-1-768x432.jpg`,
    location: 'Costa Rica',
    architect: 'Arq. Alejandro Vargas',
    images: [{ src: `${BASE}/2024/02/renders-casa-b-2_Photo-1.jpg`, alt: 'Tiny Office' }],
    description: 'Espacio de trabajo compacto diseñado para maximizar la productividad y el bienestar.',
    year: '2022',
  },
  {
    slug: 'colegio-ingenieros-agronomos',
    title: 'Colegio de Ingenieros Agrónomos — Ampliación',
    thumbnail: `${BASE}/2024/02/proyecto-1-casa-corregidas_4-Photo-768x432.jpg`,
    location: 'San José, Costa Rica',
    architect: 'Arq. Alejandro Vargas',
    images: [{ src: `${BASE}/2024/02/proyecto-1-casa-corregidas_4-Photo.jpg`, alt: 'CIA Ampliación' }],
    description: 'Ampliación institucional diseñada para responder a las necesidades actuales del gremio.',
    year: '2022',
  },

  // ── PAGE 3 ──────────────────────────────────────────────
  {
    slug: 'casa-vargas',
    title: 'Casa Vargas',
    thumbnail: `${BASE}/2023/03/DiRoca-1.png`,
    location: 'Costa Rica',
    architect: 'Juan Vargas Montes de Oca',
    images: [{ src: `${BASE}/2023/03/DiRoca-1.png`, alt: 'Casa Vargas' }],
    description: 'Residencia familiar de diseño clásico-moderno, con amplios espacios sociales.',
    year: '2022',
  },
  {
    slug: 'casa-giron-beckles',
    title: 'Casa Girón Beckles',
    thumbnail: `${BASE}/2023/03/Casa-Parrita-1.png`,
    location: 'Costa Rica',
    architect: 'Karhol Rodriguez G.',
    images: [{ src: `${BASE}/2023/03/Casa-Parrita-1.png`, alt: 'Casa Girón Beckles' }],
    description: 'Proyecto residencial con fusión de estilos contemporáneo y tropical costarricense.',
    year: '2022',
  },
  {
    slug: 'hotel-corobici',
    title: 'Hotel Corobicí',
    thumbnail: `${BASE}/2024/02/RENDERS-CASA-D_Photo-5-768x432.jpg`,
    location: 'San José, Costa Rica',
    architect: 'Arq. Alejandro Vargas',
    images: [{ src: `${BASE}/2024/02/RENDERS-CASA-D_Photo-5.jpg`, alt: 'Hotel Corobicí' }],
    description: 'Remodelación y modernización de las instalaciones del reconocido hotel capitalino.',
    year: '2021',
  },
  {
    slug: 'casa-clara-muller',
    title: 'Casa Clara Müller',
    thumbnail: `${BASE}/2024/02/RENDER-CASA-C_Photo-5-768x432.jpg`,
    location: 'Costa Rica',
    architect: 'Arq. Alejandro Vargas',
    images: [{ src: `${BASE}/2024/02/RENDER-CASA-C_Photo-5.jpg`, alt: 'Casa Clara Müller' }],
    description: 'Vivienda unifamiliar de estilo contemporáneo europeo adaptado al trópico.',
    year: '2021',
  },
  {
    slug: 'escuela-panamericana-ii',
    title: 'Escuela Panamericana II',
    thumbnail: `${BASE}/2024/02/renders-casa-b-2_Photo-1-768x432.jpg`,
    location: 'Costa Rica',
    architect: 'Juan Vargas Montes de Oca',
    images: [{ src: `${BASE}/2024/02/renders-casa-b-2_Photo-1.jpg`, alt: 'Escuela Panamericana II' }],
    description: 'Segunda etapa de construcción de la sede educativa, con enfoque en sostenibilidad.',
    year: '2021',
  },
  {
    slug: 'casa-ibeth-castro',
    title: 'Casa Ibeth Castro',
    thumbnail: `${BASE}/2024/02/proyecto-1-casa-corregidas_4-Photo-768x432.jpg`,
    location: 'Costa Rica',
    architect: 'Karhol Rodriguez G.',
    images: [{ src: `${BASE}/2024/02/proyecto-1-casa-corregidas_4-Photo.jpg`, alt: 'Casa Ibeth Castro' }],
    description: 'Residencia diseñada con atención especial a los detalles de interiores y materialidad.',
    year: '2020',
  },

  // ── PAGE 4 ──────────────────────────────────────────────
  {
    slug: 'centro-juvenil-amigo',
    title: 'Centro Juvenil Amigó',
    thumbnail: `${BASE}/2023/03/DiRoca-1.png`,
    location: 'Costa Rica',
    architect: 'Arq. Alejandro Vargas',
    images: [{ src: `${BASE}/2023/03/DiRoca-1.png`, alt: 'Centro Juvenil Amigó' }],
    description: 'Diseño y construcción de espacio comunitario orientado al desarrollo de la juventud costarricense.',
    year: '2019',
  },
];
