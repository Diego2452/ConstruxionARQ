-- ── About Blocks (Nosotros page CMS) ──────────────────────
-- Inserta 4 bloques para la página Nosotros
-- Correr en: Supabase → SQL Editor → New query

-- 1. Quiénes Somos (text-image block)
INSERT INTO about_blocks (block_type, title, subtitle, content, sort_order, is_active)
VALUES (
  'text-image',
  'Quiénes Somos',
  NULL,
  jsonb_build_object(
    'text', 'Desde 1990 logramos reconocimientos por la calidad, transparencia e integridad de nuestros miembros fundadores. Nuestros clientes nos distinguen por la excelente comunicación, liderazgo asertivo, adaptación a cada proyecto y, sobre todo, honestidad — por lo que confían 100% en el equipo.',
    'image_src', 'https://construxionarq.com/wp-content/uploads/2023/03/DiRoca-1.png',
    'image_alt', 'Proyecto DiRoca',
    'image_caption', 'Proyecto DiRoca – ConstruxionArq',
    'media_type', 'image'
  ),
  1,
  true
);

-- 2. ConstruxionArq (image-text block - reversed)
INSERT INTO about_blocks (block_type, title, subtitle, content, sort_order, is_active)
VALUES (
  'image-text',
  'ConstruxionArq',
  NULL,
  jsonb_build_object(
    'image_src', 'https://construxionarq.com/wp-content/uploads/2023/03/construxionARQ-transparente-white-rebuild-AI.png',
    'image_alt', 'ConstruxionArq',
    'image_caption', NULL,
    'media_type', 'image',
    'text', 'Antes VARGAS MONTES DE OCA ARQUITECTOS, ahora con un nombre que expresa en una sola palabra nuestra pasión: CONSTRUCCION ARQUITECTURA.

Somos un EQUIPO de arquitectos e ingenieros que trabajamos separados o unidos según la necesidad de cada cliente. El corazón del equipo es la familia Vargas Montes de Oca, con más de 30 años de experiencia nacional.

Desde 2016, el Arq. Alejandro Vargas transformó el concepto de «empresa» a «equipo», reduciendo costos operativos sin sacrificar la calidad de los servicios.'
  ),
  2,
  true
);

-- 3. Diferenciadores (bullets-image block)
INSERT INTO about_blocks (block_type, title, subtitle, content, sort_order, is_active)
VALUES (
  'bullets-image',
  'Diferenciadores',
  'Nos destacamos en:',
  jsonb_build_object(
    'bullets', jsonb_build_array(
      'Arquitectura, diseño y construcción personalizados y orientados al detalle.',
      'Servicios profesionales de alta calidad a precios justos y competitivos.',
      'Estudios, asesorías y diseños preliminares inclusive antes de la compra del terreno.',
      'Planos y especificaciones técnicas altamente detallados para cada necesidad.',
      'Trámites y permisos ágiles ante todas las instituciones y municipalidades del país.',
      'Servicios complementarios: avalúos, estudios técnicos de terrenos y más.',
      'Administración de proyectos e integración de todos los servicios de ingeniería.'
    ),
    'image_src', '',
    'image_alt', '',
    'image_caption', NULL,
    'media_type', 'image'
  ),
  3,
  true
);

-- 4. El Equipo (team block)
INSERT INTO about_blocks (block_type, title, subtitle, content, sort_order, is_active)
VALUES (
  'team',
  'El Equipo',
  'Nuestro Equipo',
  jsonb_build_object(
    'members', jsonb_build_array(
      jsonb_build_object(
        'name', 'Arq. Alejandro Vargas',
        'role', 'Director General – Primer Arquitecto',
        'photo_src', 'https://construxionarq.com/wp-content/uploads/2023/03/5.-Alejandro-OnlyPicture-1-768x768.png',
        'photo_alt', 'Arq. Alejandro Vargas',
        'bio', 'Arquitecto Licenciado, Máster en Gerencia de Proyectos con énfasis en Construcción. Bilingüe Español – Inglés 100%. Registrado en CFIA # A-25A16. Dominio de Revit, AutoCad, SketchUp, Lumion, TwinMotion, MS Project y BIM. Experiencia desde 1995 en proyectos de estándar internacional. Se distingue por su liderazgo asertivo, gestión honesta y resultados de excelencia.'
      ),
      jsonb_build_object(
        'name', 'Juan Vargas Montes de Oca',
        'role', 'Diseñador y Constructor Senior',
        'photo_src', 'https://construxionarq.com/wp-content/uploads/2023/03/8.-TioJuan-Profile-768x769.png',
        'photo_alt', 'Juan Vargas Montes de Oca',
        'bio', 'Iniciando como Diseñador desde 1975 y Constructor desde 1980, con más de 120 construcciones a su haber. Pionero y fundador de Constructora Vargas Montes de Oca. Experto en sistemas constructivos y estructurales de toda índole, desde vivienda económica hasta edificios complejos. Referente en construcción tropical, sistemas en madera y gestión eficiente de recursos.'
      ),
      jsonb_build_object(
        'name', 'Karhol Rodriguez G.',
        'role', 'Arquitecta – Diseñadora Senior',
        'photo_src', 'https://construxionarq.com/wp-content/uploads/2023/03/6.-Karhol-Profile-768x769.png',
        'photo_alt', 'Karhol Rodriguez G.',
        'bio', 'Licenciada en Arquitectura por la UCR. Bilingüe Inglés – Español. Miembro activo CFIA carné: A-33837. AutoCad, SketchUp, Lumion, Unreal Engine, MS Project, BIM, Adobe. Experiencia desde 2010. Enfoque en diseño retador, presupuesto y control de obra con atención especial al detalle.'
      )
    )
  ),
  4,
  true
);

-- Extra: Trayectoria block (opcional, para completar más adelante)
INSERT INTO about_blocks (block_type, title, subtitle, content, sort_order, is_active)
VALUES (
  'text',
  'Trayectoria',
  'Clientes y Aliados',
  jsonb_build_object(
    'text', 'Durante más de tres décadas hemos construido relaciones sólidas con clientes privados, empresas del sector construcción, instituciones educativas y organismos públicos en todo el territorio nacional. Cada proyecto es una nueva oportunidad de superar expectativas y dejar una huella de calidad duradera.'
  ),
  5,
  true
);
