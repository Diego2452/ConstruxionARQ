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
      { src: `${BASE}/2024/02/RENDERS-CASA-D_Photo-5-scaled.jpg`,  alt: 'Casa D – vista principal',   caption: 'Fachada Principal'  },
      { src: `${BASE}/2024/02/RENDERS-CASA-D_Photo-9-scaled.jpg`,  alt: 'Casa D – vista lejana 1',    caption: 'Vista Lejana'       },
      { src: `${BASE}/2024/02/RENDERS-CASA-D_Photo-7-scaled.jpg`,  alt: 'Casa D – exterior 2',        caption: 'Exterior 2'         },
      { src: `${BASE}/2024/02/RENDERS-CASA-D_Photo-3-scaled.jpg`,  alt: 'Casa D – exterior 3',        caption: 'Exterior 3'         },
      { src: `${BASE}/2024/02/RENDERS-CASA-D_Photo-2-scaled.jpg`,  alt: 'Casa D – exterior 4',        caption: 'Exterior 4'         },
      { src: `${BASE}/2024/02/RENDERS-CASA-D_Photo-1-scaled.jpg`,  alt: 'Casa D – exterior 5',        caption: 'Exterior 5'         },
      { src: `${BASE}/2024/02/RENDERS-CASA-D_Photo-10-scaled.jpg`, alt: 'Casa D – vista cercana 1',   caption: 'Vista de Cerca 1'   },
      { src: `${BASE}/2024/02/RENDERS-CASA-D_Photo-8-scaled.jpg`,  alt: 'Casa D – vista cercana 2',   caption: 'Vista de Cerca 2'   },
      { src: `${BASE}/2024/02/RENDERS-CASA-D_Photo-6-scaled.jpg`,  alt: 'Casa D – vista cercana 3',   caption: 'Vista de Cerca 3'   },
      { src: `${BASE}/2024/02/RENDERS-CASA-D_Photo-4-scaled.jpg`,  alt: 'Casa D – vista cercana 4',   caption: 'Vista de Cerca 4'   },
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
      { src: `${BASE}/2024/02/RENDER-CASA-C_Photo-5-scaled.jpg`, alt: 'Casa C – fachada',        caption: 'Fachada'             },
      { src: `${BASE}/2024/02/RENDER-CASA-C_Photo-4-scaled.jpg`, alt: 'Casa C – render día 1',   caption: 'Render Diurno 1'     },
      { src: `${BASE}/2024/02/RENDER-CASA-C_Photo-1-scaled.jpg`, alt: 'Casa C – render día 2',   caption: 'Render Diurno 2'     },
      { src: `${BASE}/2024/02/RENDER-CASA-C_Photo-2-scaled.jpg`, alt: 'Casa C – render día 3',   caption: 'Render Diurno 3'     },
      { src: `${BASE}/2024/02/RENDER-CASA-C_Photo-3-scaled.jpg`, alt: 'Casa C – render día 4',   caption: 'Render Diurno 4'     },
      { src: `${BASE}/2024/02/RENDER-CASA-C_Photo-7-scaled.jpg`, alt: 'Casa C – tarde 1',        caption: 'Render Vespertino 1' },
      { src: `${BASE}/2024/02/RENDER-CASA-C_Photo-6-scaled.jpg`, alt: 'Casa C – tarde 2',        caption: 'Render Vespertino 2' },
      { src: `${BASE}/2024/02/render_Photo-7-scaled.jpg`,         alt: 'Casa C – tarde 3',        caption: 'Render Vespertino 3' },
      { src: `${BASE}/2024/02/render_Photo-6-scaled.jpg`,         alt: 'Casa C – tarde 4',        caption: 'Render Vespertino 4' },
      { src: `${BASE}/2024/02/render_Photo-5-scaled.jpg`,         alt: 'Casa C – tarde 5',        caption: 'Render Vespertino 5' },
      { src: `${BASE}/2024/02/IMG-20200616-WA0123.jpg`,           alt: 'Casa C – construcción 1', caption: 'Construcción 1'      },
      { src: `${BASE}/2024/02/IMG-20200616-WA0124.jpg`,           alt: 'Casa C – construcción 2', caption: 'Construcción 2'      },
      { src: `${BASE}/2024/02/IMG-20200616-WA0122.jpg`,           alt: 'Casa C – construcción 3', caption: 'Construcción 3'      },
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
      { src: `${BASE}/2024/02/renders-casa-b-2_Photo-1-scaled.jpg`, alt: 'Casa B – fachada',        caption: 'Fachada'         },
      { src: `${BASE}/2024/02/render-casa-b_Photo-5-scaled.jpg`,     alt: 'Casa B – render final 1', caption: 'Render Final 1'  },
      { src: `${BASE}/2024/02/render-casa-b_Photo-2-scaled.jpg`,     alt: 'Casa B – render final 2', caption: 'Render Final 2'  },
      { src: `${BASE}/2024/02/renders-casa-b-2_Photo-6-scaled.jpg`,  alt: 'Casa B – render final 3', caption: 'Render Final 3'  },
      { src: `${BASE}/2024/02/renders-casa-b-2_Photo-5-scaled.jpg`,  alt: 'Casa B – render final 4', caption: 'Render Final 4'  },
      { src: `${BASE}/2024/02/renders-casa-b-2_Photo-2-scaled.jpg`,  alt: 'Casa B – render final 5', caption: 'Render Final 5'  },
      { src: `${BASE}/2024/02/render-casa-b_Photo-4-scaled.jpg`,     alt: 'Casa B – terraza 1',      caption: 'Terraza 1'       },
      { src: `${BASE}/2024/02/renders-casa-b-2_Photo-8-scaled.jpg`,  alt: 'Casa B – terraza 2',      caption: 'Terraza 2'       },
      { src: `${BASE}/2024/02/renders-casa-b-2_Photo-7-scaled.jpg`,  alt: 'Casa B – terraza 3',      caption: 'Terraza 3'       },
      { src: `${BASE}/2024/02/renders-casa-b-2_Photo-4-scaled.jpg`,  alt: 'Casa B – terraza 4',      caption: 'Terraza 4'       },
      { src: `${BASE}/2024/02/renders-casa-b-2_Photo-3-scaled.jpg`,  alt: 'Casa B – terraza 5',      caption: 'Terraza 5'       },
      { src: `${BASE}/2024/02/IMG-20200616-WA0088-1.jpg`,            alt: 'Casa B – construcción 1', caption: 'Construcción 1'  },
      { src: `${BASE}/2024/02/IMG-20200616-WA0087-1.jpg`,            alt: 'Casa B – construcción 2', caption: 'Construcción 2'  },
      { src: `${BASE}/2024/02/IMG-20200616-WA0086-1.jpg`,            alt: 'Casa B – construcción 3', caption: 'Construcción 3'  },
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
      { src: `${BASE}/2024/02/proyecto-1-casa-corregidas_4-Photo-scaled.jpg`, alt: 'Casa A – render principal', caption: 'Render Principal' },
      { src: `${BASE}/2024/02/proyecto-1-casa-c-oscuro_2-Photo-scaled.jpg`,   alt: 'Casa A – render final 1',  caption: 'Render Final 1'   },
      { src: `${BASE}/2024/02/proyecto-1-casa-c-oscuro_4-Photo-scaled.jpg`,   alt: 'Casa A – render final 2',  caption: 'Render Final 2'   },
      { src: `${BASE}/2024/02/proyecto-1-casa-corregidas_7-Photo-scaled.jpg`, alt: 'Casa A – render final 3',  caption: 'Render Final 3'   },
      { src: `${BASE}/2024/02/proyecto-1-casa-corregidas_1-Photo-scaled.jpg`, alt: 'Casa A – render final 4',  caption: 'Render Final 4'   },
      { src: `${BASE}/2024/02/proyecto-1-casa-corregidas_6-Photo-scaled.jpg`, alt: 'Casa A – modelo 1',        caption: 'Modelo Básico 1'  },
      { src: `${BASE}/2024/02/proyecto-1-casa-corregidas_5-Photo-scaled.jpg`, alt: 'Casa A – modelo 2',        caption: 'Modelo Básico 2'  },
      { src: `${BASE}/2024/02/26902927072_6c84231dd0_o-scaled.jpg`,           alt: 'Casa A – construcción 1',  caption: 'Construcción 1'   },
      { src: `${BASE}/2024/02/26094533726_aa659f2d3a_o-scaled.jpg`,           alt: 'Casa A – construcción 2',  caption: 'Construcción 2'   },
      { src: `${BASE}/2024/02/26723372520_798310634b_o-scaled.jpg`,           alt: 'Casa A – construcción 3',  caption: 'Construcción 3'   },
    ],
  },
  {
    slug: 'casa-parrita',
    title: 'Casa Parrita',
    thumbnail: `${BASE}/2023/03/Casa-Parrita-1.png`,
    location: 'Parrita, Puntarenas, Costa Rica',
    manager: 'Arq. Alejandro Vargas',
    architect: 'Arq. Alejandro Vargas',
    dimensions: '150 Metros Cuadrados',
    year: '2023',
    description: 'Casa costera con ventilación natural ubicada a un kilómetro del mar. Zona de alta humedad y calor. Se resuelve arquitectónicamente elevándola 80 cm del suelo e incorporando un elaborado diseño de cielos y aperturas especiales que enfrían los espacios sin equipos de aire acondicionado. Se logró un costo 15% menor al presupuestado.',
    images: [
      { src: `${BASE}/2023/03/Casa-Parrita-1.png`, alt: 'Casa Parrita – exterior', caption: 'Exterior' },
      { src: `${BASE}/2023/03/Casa-Parrita-2.png`, alt: 'Casa Parrita – detalles', caption: 'Detalles' },
    ],
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
    description: 'Complejo habitacional de 9 apartamentos y una casa de habitación. El diseño escalonado permite que el proyecto tome la forma orgánica del terreno, procurando una intervención artificial mínima y generando una fachada dinámica.',
    images: [
      { src: `${BASE}/2020/08/DiRoca-1.png`,  alt: 'DiRoca – fachada principal', caption: 'Fachada'        },
      { src: `${BASE}/2020/08/DiRoca-Map.png`, alt: 'DiRoca – planos',            caption: 'Planos'         },
      { src: `${BASE}/2023/03/DiRoca-4.png`,  alt: 'DiRoca – cocina',            caption: 'Cocina'         },
      { src: `${BASE}/2023/03/DiRoca-1.png`,  alt: 'DiRoca – exterior',          caption: 'Exterior'       },
      { src: `${BASE}/2023/03/DiRoca-2.png`,  alt: 'DiRoca – habitación',        caption: 'Habitación'     },
      { src: `${BASE}/2023/03/DiRoca-3.png`,  alt: 'DiRoca – jardín interno',    caption: 'Jardín Interno' },
    ],
  },

  // ── PAGE 2 ──────────────────────────────────────────────
  {
    slug: 'condominio-escazu-01',
    title: 'Condominio Escazú 01',
    thumbnail: `${BASE}/2023/03/Condominio-Escazu-01-1.png`,
    location: 'Escazú, San José, Costa Rica',
    architect: 'Arq. Alejandro Vargas',
    year: '2023',
    description: 'Condominio contemporáneo en uno de los sectores más exclusivos de la Gran Área Metropolitana.',
    images: [
      { src: `${BASE}/2023/03/Condominio-Escazu-01-1.png`, alt: 'Condominio Escazú 01', caption: 'Exterior' },
    ],
  },
  {
    slug: 'casa-salgado',
    title: 'Casa Salgado',
    thumbnail: `${BASE}/2023/03/Casa-Salgado-1.png`,
    location: 'Costa Rica',
    architect: 'Karhol Rodriguez G.',
    year: '2023',
    description: 'Residencia familiar diseñada con énfasis en privacidad y funcionalidad.',
    images: [
      { src: `${BASE}/2023/03/Casa-Salgado-1.png`,                     alt: 'Casa Salgado – exterior',   caption: 'Exterior'   },
      { src: `${BASE}/2024/02/Interior-Salgado-dic-18_14-Photo.jpg`,    alt: 'Casa Salgado – interior 1', caption: 'Interior 1' },
      { src: `${BASE}/2024/02/Interior-Salgado-dic-18_18-Photo.jpg`,    alt: 'Casa Salgado – interior 2', caption: 'Interior 2' },
      { src: `${BASE}/2024/02/Interior-Salgado-dic-18_23-Photo.jpg`,    alt: 'Casa Salgado – interior 3', caption: 'Interior 3' },
      { src: `${BASE}/2024/02/Interior-Salgado-dic-18_20-Photo.jpg`,    alt: 'Casa Salgado – interior 4', caption: 'Interior 4' },
    ],
  },
  {
    slug: 'casa-sierra',
    title: 'Casa Sierra',
    thumbnail: `${BASE}/2023/03/Casa-Sierra-1.png`,
    location: 'Costa Rica',
    architect: 'Arq. Alejandro Vargas',
    year: '2023',
    description: 'Diseño arquitectónico integrado al paisaje montañoso costarricense.',
    images: [
      { src: `${BASE}/2023/03/Casa-Sierra-1.png`, alt: 'Casa Sierra – exterior', caption: 'Exterior' },
    ],
  },
  {
    slug: 'tiny-home',
    title: 'Tiny Home',
    thumbnail: `${BASE}/2023/03/Tiny-Home-1.png`,
    location: 'Costa Rica',
    architect: 'Karhol Rodriguez G.',
    year: '2023',
    description: 'Vivienda compacta de alta eficiencia con diseño sostenible y materiales naturales.',
    images: [
      { src: `${BASE}/2023/03/Tiny-Home-1.png`, alt: 'Tiny Home – exterior', caption: 'Exterior' },
    ],
  },
  {
    slug: 'tiny-office',
    title: 'Tiny Office',
    thumbnail: `${BASE}/2023/03/Tiny-Office-1.png`,
    location: 'Costa Rica',
    architect: 'Arq. Alejandro Vargas',
    year: '2023',
    description: 'Espacio de trabajo compacto diseñado para maximizar la productividad y el bienestar.',
    images: [
      { src: `${BASE}/2023/03/Tiny-Office-1.png`, alt: 'Tiny Office – exterior', caption: 'Exterior' },
    ],
  },
  {
    slug: 'colegio-de-ingenieros-agronomos-ampliacion',
    title: 'Colegio de Ingenieros Agrónomos (Ampliación)',
    thumbnail: `${BASE}/2023/03/Colegio-de-Ingenieros-Agronomos-1.png`,
    location: 'San José, Costa Rica',
    architect: 'Arq. Alejandro Vargas',
    year: '2022',
    description: 'Ampliación institucional diseñada para responder a las necesidades actuales del gremio.',
    images: [
      { src: `${BASE}/2023/03/Colegio-de-Ingenieros-Agronomos-1.png`, alt: 'CIA Ampliación – exterior', caption: 'Exterior' },
    ],
  },

  // ── PAGE 3 ──────────────────────────────────────────────
  {
    slug: 'casa-vargas',
    title: 'Casa Vargas',
    thumbnail: `${BASE}/2023/03/Casa-Vargas-1.png`,
    location: 'Costa Rica',
    architect: 'Juan Vargas Montes de Oca',
    year: '2022',
    description: 'Residencia familiar de diseño clásico-moderno, con amplios espacios sociales.',
    images: [
      { src: `${BASE}/2023/03/Casa-Vargas-1.png`, alt: 'Casa Vargas – exterior', caption: 'Exterior' },
    ],
  },
  {
    slug: 'casa-giron-beckles',
    title: 'Casa Girón Beckles',
    thumbnail: `${BASE}/2023/03/Casa-Giron-Beckles-1.png`,
    location: 'Costa Rica',
    architect: 'Karhol Rodriguez G.',
    year: '2022',
    description: 'Proyecto residencial con fusión de estilos contemporáneo y tropical costarricense.',
    images: [
      { src: `${BASE}/2023/03/Casa-Giron-Beckles-1.png`,         alt: 'Casa Girón Beckles – exterior',  caption: 'Exterior'  },
      { src: `${BASE}/2024/02/fachada-render_3-Photo-scaled.jpg`, alt: 'Casa Girón Beckles – render 1', caption: 'Render 1'  },
      { src: `${BASE}/2024/02/fachada-render_5-Photo-scaled.jpg`, alt: 'Casa Girón Beckles – render 2', caption: 'Render 2'  },
      { src: `${BASE}/2024/02/fachada-render_4-Photo-scaled.jpg`, alt: 'Casa Girón Beckles – render 3', caption: 'Render 3'  },
      { src: `${BASE}/2024/02/fachada-render_1-Photo-scaled.jpg`, alt: 'Casa Girón Beckles – render 4', caption: 'Render 4'  },
    ],
  },
  {
    slug: 'hotel-corobici',
    title: 'Hotel Corobicí',
    thumbnail: `${BASE}/2023/03/Hotel-Corobici-1.png`,
    location: 'San José, Costa Rica',
    architect: 'Arq. Alejandro Vargas',
    year: '2021',
    description: 'Remodelación y modernización de las instalaciones del reconocido hotel capitalino.',
    images: [
      { src: `${BASE}/2023/03/Hotel-Corobici-1.png`, alt: 'Hotel Corobicí – exterior', caption: 'Exterior' },
    ],
  },
  {
    slug: 'casa-clara-muller',
    title: 'Casa Clara Müller',
    thumbnail: `${BASE}/2023/03/Casa-Clara-Muller-1.png`,
    location: 'Costa Rica',
    architect: 'Arq. Alejandro Vargas',
    year: '2021',
    description: 'Vivienda unifamiliar de estilo contemporáneo europeo adaptado al trópico.',
    images: [
      { src: `${BASE}/2023/03/Casa-Clara-Muller-1.png`, alt: 'Casa Clara Müller – exterior', caption: 'Exterior' },
    ],
  },
  {
    slug: 'escuela-panamericana-ii',
    title: 'Escuela Panamericana II',
    thumbnail: `${BASE}/2023/03/Escuela-Panamericana-II-1.png`,
    location: 'Costa Rica',
    architect: 'Juan Vargas Montes de Oca',
    year: '2021',
    description: 'Segunda etapa de construcción de la sede educativa, con enfoque en sostenibilidad.',
    images: [
      { src: `${BASE}/2023/03/Escuela-Panamericana-II-1.png`, alt: 'Escuela Panamericana II – exterior', caption: 'Exterior' },
    ],
  },
  {
    slug: 'casa-ibeth-castro',
    title: 'Casa Ibeth Castro',
    thumbnail: `${BASE}/2023/03/Casa-Ibeth-Castro-1.png`,
    location: 'Costa Rica',
    architect: 'Karhol Rodriguez G.',
    year: '2020',
    description: 'Residencia diseñada con atención especial a los detalles de interiores y materialidad.',
    images: [
      { src: `${BASE}/2023/03/Casa-Ibeth-Castro-1.png`, alt: 'Casa Ibeth Castro – exterior', caption: 'Exterior' },
    ],
  },

  // ── PAGE 4 ──────────────────────────────────────────────
  {
    slug: 'centro-juvenil-amigo',
    title: 'Centro Juvenil Amigó',
    thumbnail: `${BASE}/2023/03/Centro-Juvenil-Amigo-1.png`,
    location: 'Costa Rica',
    architect: 'Arq. Alejandro Vargas',
    year: '2019',
    description: 'Diseño y construcción de espacio comunitario orientado al desarrollo de la juventud costarricense.',
    images: [
      { src: `${BASE}/2023/03/Centro-Juvenil-Amigo-1.png`, alt: 'Centro Juvenil Amigó – exterior', caption: 'Exterior' },
    ],
  },
];