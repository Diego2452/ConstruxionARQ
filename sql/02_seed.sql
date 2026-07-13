-- ── ConstruxionARQ — Seed: 19 proyectos existentes ────
-- Correr DESPUÉS de 01_schema.sql

-- Helper: insert project + images in one go
-- Usage: just run this entire file

DO $$
DECLARE
  BASE TEXT := 'https://construxionarq.com/wp-content/uploads';
  pid  UUID;
BEGIN

-- ══ CASA D ══════════════════════════════════════════
INSERT INTO projects (slug,title,location,year,description)
VALUES ('casa-d','Casa No.D','Costa Rica','2024',
  'Proyecto de vivienda residencial con una propuesta arquitectónica contemporánea que equilibra vistas amplias, integración al entorno y eficiencia espacial en cada nivel.')
RETURNING id INTO pid;
INSERT INTO project_images(project_id,src,alt,caption,is_primary,sort_order) VALUES
(pid,BASE||'/2024/02/RENDERS-CASA-D_Photo-5-scaled.jpg','Casa D – vista principal','Fachada Principal',true,0),
(pid,BASE||'/2024/02/RENDERS-CASA-D_Photo-9-scaled.jpg','Casa D – vista lejana','Vista Lejana',false,1),
(pid,BASE||'/2024/02/RENDERS-CASA-D_Photo-7-scaled.jpg','Casa D – exterior 2','Exterior 2',false,2),
(pid,BASE||'/2024/02/RENDERS-CASA-D_Photo-3-scaled.jpg','Casa D – exterior 3','Exterior 3',false,3),
(pid,BASE||'/2024/02/RENDERS-CASA-D_Photo-2-scaled.jpg','Casa D – exterior 4','Exterior 4',false,4),
(pid,BASE||'/2024/02/RENDERS-CASA-D_Photo-1-scaled.jpg','Casa D – exterior 5','Exterior 5',false,5),
(pid,BASE||'/2024/02/RENDERS-CASA-D_Photo-10-scaled.jpg','Casa D – cercana 1','Vista de Cerca 1',false,6),
(pid,BASE||'/2024/02/RENDERS-CASA-D_Photo-8-scaled.jpg','Casa D – cercana 2','Vista de Cerca 2',false,7),
(pid,BASE||'/2024/02/RENDERS-CASA-D_Photo-6-scaled.jpg','Casa D – cercana 3','Vista de Cerca 3',false,8),
(pid,BASE||'/2024/02/RENDERS-CASA-D_Photo-4-scaled.jpg','Casa D – cercana 4','Vista de Cerca 4',false,9);

-- ══ CASA C ══════════════════════════════════════════
INSERT INTO projects (slug,title,location,year,description)
VALUES ('casa-c','Casa C','Costa Rica','2024',
  'Vivienda unifamiliar de diseño contemporáneo con énfasis en la integración entre espacios interiores y exteriores, acabados de alta calidad y propuesta volumétrica distintiva.')
RETURNING id INTO pid;
INSERT INTO project_images(project_id,src,alt,caption,is_primary,sort_order) VALUES
(pid,BASE||'/2024/02/RENDER-CASA-C_Photo-5-scaled.jpg','Casa C – fachada','Fachada',true,0),
(pid,BASE||'/2024/02/RENDER-CASA-C_Photo-4-scaled.jpg','Casa C – día 1','Render Diurno 1',false,1),
(pid,BASE||'/2024/02/RENDER-CASA-C_Photo-1-scaled.jpg','Casa C – día 2','Render Diurno 2',false,2),
(pid,BASE||'/2024/02/RENDER-CASA-C_Photo-2-scaled.jpg','Casa C – día 3','Render Diurno 3',false,3),
(pid,BASE||'/2024/02/RENDER-CASA-C_Photo-3-scaled.jpg','Casa C – día 4','Render Diurno 4',false,4),
(pid,BASE||'/2024/02/RENDER-CASA-C_Photo-7-scaled.jpg','Casa C – tarde 1','Render Vespertino 1',false,5),
(pid,BASE||'/2024/02/RENDER-CASA-C_Photo-6-scaled.jpg','Casa C – tarde 2','Render Vespertino 2',false,6),
(pid,BASE||'/2024/02/render_Photo-7-scaled.jpg','Casa C – tarde 3','Render Vespertino 3',false,7),
(pid,BASE||'/2024/02/render_Photo-6-scaled.jpg','Casa C – tarde 4','Render Vespertino 4',false,8),
(pid,BASE||'/2024/02/render_Photo-5-scaled.jpg','Casa C – tarde 5','Render Vespertino 5',false,9),
(pid,BASE||'/2024/02/IMG-20200616-WA0123.jpg','Casa C – construcción 1','Construcción 1',false,10),
(pid,BASE||'/2024/02/IMG-20200616-WA0124.jpg','Casa C – construcción 2','Construcción 2',false,11),
(pid,BASE||'/2024/02/IMG-20200616-WA0122.jpg','Casa C – construcción 3','Construcción 3',false,12);

-- ══ CASA B ══════════════════════════════════════════
INSERT INTO projects (slug,title,location,year,description)
VALUES ('casa-b','Casa B','Costa Rica','2024',
  'Casa de diseño moderno con terraza panorámica y amplios espacios de convivencia. El proyecto combina renders de alta fidelidad con fotografías reales del proceso constructivo.')
RETURNING id INTO pid;
INSERT INTO project_images(project_id,src,alt,caption,is_primary,sort_order) VALUES
(pid,BASE||'/2024/02/renders-casa-b-2_Photo-1-scaled.jpg','Casa B – fachada','Fachada',true,0),
(pid,BASE||'/2024/02/render-casa-b_Photo-5-scaled.jpg','Casa B – final 1','Render Final 1',false,1),
(pid,BASE||'/2024/02/render-casa-b_Photo-2-scaled.jpg','Casa B – final 2','Render Final 2',false,2),
(pid,BASE||'/2024/02/renders-casa-b-2_Photo-6-scaled.jpg','Casa B – final 3','Render Final 3',false,3),
(pid,BASE||'/2024/02/renders-casa-b-2_Photo-5-scaled.jpg','Casa B – final 4','Render Final 4',false,4),
(pid,BASE||'/2024/02/renders-casa-b-2_Photo-2-scaled.jpg','Casa B – final 5','Render Final 5',false,5),
(pid,BASE||'/2024/02/render-casa-b_Photo-4-scaled.jpg','Casa B – terraza 1','Terraza 1',false,6),
(pid,BASE||'/2024/02/renders-casa-b-2_Photo-8-scaled.jpg','Casa B – terraza 2','Terraza 2',false,7),
(pid,BASE||'/2024/02/renders-casa-b-2_Photo-7-scaled.jpg','Casa B – terraza 3','Terraza 3',false,8),
(pid,BASE||'/2024/02/renders-casa-b-2_Photo-4-scaled.jpg','Casa B – terraza 4','Terraza 4',false,9),
(pid,BASE||'/2024/02/renders-casa-b-2_Photo-3-scaled.jpg','Casa B – terraza 5','Terraza 5',false,10),
(pid,BASE||'/2024/02/IMG-20200616-WA0088-1.jpg','Casa B – construcción 1','Construcción 1',false,11),
(pid,BASE||'/2024/02/IMG-20200616-WA0087-1.jpg','Casa B – construcción 2','Construcción 2',false,12),
(pid,BASE||'/2024/02/IMG-20200616-WA0086-1.jpg','Casa B – construcción 3','Construcción 3',false,13);

-- ══ CASA A ══════════════════════════════════════════
INSERT INTO projects (slug,title,location,year,description)
VALUES ('casa-a','Casa A','Costa Rica','2024',
  'Residencia unifamiliar con una propuesta volumétrica que integra modelos básicos y renders finales de alta definición, complementada con fotografías reales del proceso de construcción.')
RETURNING id INTO pid;
INSERT INTO project_images(project_id,src,alt,caption,is_primary,sort_order) VALUES
(pid,BASE||'/2024/02/proyecto-1-casa-corregidas_4-Photo-scaled.jpg','Casa A – render principal','Render Principal',true,0),
(pid,BASE||'/2024/02/proyecto-1-casa-c-oscuro_2-Photo-scaled.jpg','Casa A – final 1','Render Final 1',false,1),
(pid,BASE||'/2024/02/proyecto-1-casa-c-oscuro_4-Photo-scaled.jpg','Casa A – final 2','Render Final 2',false,2),
(pid,BASE||'/2024/02/proyecto-1-casa-corregidas_7-Photo-scaled.jpg','Casa A – final 3','Render Final 3',false,3),
(pid,BASE||'/2024/02/proyecto-1-casa-corregidas_1-Photo-scaled.jpg','Casa A – final 4','Render Final 4',false,4),
(pid,BASE||'/2024/02/proyecto-1-casa-corregidas_6-Photo-scaled.jpg','Casa A – modelo 1','Modelo Básico 1',false,5),
(pid,BASE||'/2024/02/proyecto-1-casa-corregidas_5-Photo-scaled.jpg','Casa A – modelo 2','Modelo Básico 2',false,6),
(pid,BASE||'/2024/02/26902927072_6c84231dd0_o-scaled.jpg','Casa A – construcción 1','Construcción 1',false,7),
(pid,BASE||'/2024/02/26094533726_aa659f2d3a_o-scaled.jpg','Casa A – construcción 2','Construcción 2',false,8),
(pid,BASE||'/2024/02/26723372520_798310634b_o-scaled.jpg','Casa A – construcción 3','Construcción 3',false,9);

-- ══ CASA PARRITA ═══════════════════════════════════
INSERT INTO projects (slug,title,location,manager,architect,dimensions,year,description)
VALUES ('casa-parrita','Casa Parrita','Parrita, Puntarenas, Costa Rica','Arq. Alejandro Vargas','Arq. Alejandro Vargas','150 Metros Cuadrados','2023',
  'Casa costera con ventilación natural ubicada a un kilómetro del mar. Zona de alta humedad y calor. Se resuelve arquitectónicamente elevándola 80 cm del suelo e incorporando un elaborado diseño de cielos y aperturas especiales que enfrían los espacios sin equipos de aire acondicionado. Se logró un costo 15% menor al presupuestado.')
RETURNING id INTO pid;
INSERT INTO project_images(project_id,src,alt,caption,is_primary,sort_order) VALUES
(pid,BASE||'/2023/03/Casa-Parrita-1.png','Casa Parrita – exterior','Exterior',true,0),
(pid,BASE||'/2023/03/Casa-Parrita-2.png','Casa Parrita – detalles','Detalles',false,1);

-- ══ DIROCA ═════════════════════════════════════════
INSERT INTO projects (slug,title,location,manager,architect,dimensions,year,description)
VALUES ('complejo-de-apartamentos-diroca','Complejo de Apartamentos DiRoca','San Antonio de Escazú, San José, Costa Rica','Mario Chavarria','Karhol Rodriguez G.','1,100 Metros Cuadrados','2020',
  'Complejo habitacional de 9 apartamentos y una casa de habitación. El diseño escalonado permite que el proyecto tome la forma orgánica del terreno, procurando una intervención artificial mínima y generando una fachada dinámica.')
RETURNING id INTO pid;
INSERT INTO project_images(project_id,src,alt,caption,is_primary,sort_order) VALUES
(pid,BASE||'/2020/08/DiRoca-1.png','DiRoca – fachada principal','Fachada',true,0),
(pid,BASE||'/2020/08/DiRoca-Map.png','DiRoca – planos','Planos',false,1),
(pid,BASE||'/2023/03/DiRoca-4.png','DiRoca – cocina','Cocina',false,2),
(pid,BASE||'/2023/03/DiRoca-1.png','DiRoca – exterior','Exterior',false,3),
(pid,BASE||'/2023/03/DiRoca-2.png','DiRoca – habitación','Habitación',false,4),
(pid,BASE||'/2023/03/DiRoca-3.png','DiRoca – jardín','Jardín Interno',false,5);

-- ══ CONDOMINIO ESCAZÚ ══════════════════════════════
INSERT INTO projects (slug,title,location,architect,year,description)
VALUES ('condominio-escazu-01','Condominio Escazú 01','Escazú, San José, Costa Rica','Arq. Alejandro Vargas','2023',
  'Condominio contemporáneo en uno de los sectores más exclusivos de la Gran Área Metropolitana.')
RETURNING id INTO pid;
INSERT INTO project_images(project_id,src,alt,caption,is_primary,sort_order) VALUES
(pid,BASE||'/2023/03/Condominio-Escazu-01-1.png','Condominio Escazú 01','Exterior',true,0);

-- ══ CASA SALGADO ═══════════════════════════════════
INSERT INTO projects (slug,title,location,architect,year,description)
VALUES ('casa-salgado','Casa Salgado','Costa Rica','Karhol Rodriguez G.','2023',
  'Residencia familiar diseñada con énfasis en privacidad y funcionalidad.')
RETURNING id INTO pid;
INSERT INTO project_images(project_id,src,alt,caption,is_primary,sort_order) VALUES
(pid,BASE||'/2023/03/Casa-Salgado-1.png','Casa Salgado – exterior','Exterior',true,0),
(pid,BASE||'/2024/02/Interior-Salgado-dic-18_14-Photo.jpg','Casa Salgado – interior 1','Interior 1',false,1),
(pid,BASE||'/2024/02/Interior-Salgado-dic-18_18-Photo.jpg','Casa Salgado – interior 2','Interior 2',false,2),
(pid,BASE||'/2024/02/Interior-Salgado-dic-18_23-Photo.jpg','Casa Salgado – interior 3','Interior 3',false,3),
(pid,BASE||'/2024/02/Interior-Salgado-dic-18_20-Photo.jpg','Casa Salgado – interior 4','Interior 4',false,4);

-- ══ CASA SIERRA ════════════════════════════════════
INSERT INTO projects (slug,title,location,architect,year,description)
VALUES ('casa-sierra','Casa Sierra','Costa Rica','Arq. Alejandro Vargas','2023',
  'Diseño arquitectónico integrado al paisaje montañoso costarricense.')
RETURNING id INTO pid;
INSERT INTO project_images(project_id,src,alt,caption,is_primary,sort_order) VALUES
(pid,BASE||'/2023/03/Casa-Sierra-1.png','Casa Sierra – exterior','Exterior',true,0);

-- ══ TINY HOME ══════════════════════════════════════
INSERT INTO projects (slug,title,location,architect,year,description)
VALUES ('tiny-home','Tiny Home','Costa Rica','Karhol Rodriguez G.','2023',
  'Vivienda compacta de alta eficiencia con diseño sostenible y materiales naturales.')
RETURNING id INTO pid;
INSERT INTO project_images(project_id,src,alt,caption,is_primary,sort_order) VALUES
(pid,BASE||'/2023/03/Tiny-Home-1.png','Tiny Home – exterior','Exterior',true,0);

-- ══ TINY OFFICE ════════════════════════════════════
INSERT INTO projects (slug,title,location,architect,year,description)
VALUES ('tiny-office','Tiny Office','Costa Rica','Arq. Alejandro Vargas','2023',
  'Espacio de trabajo compacto diseñado para maximizar la productividad y el bienestar.')
RETURNING id INTO pid;
INSERT INTO project_images(project_id,src,alt,caption,is_primary,sort_order) VALUES
(pid,BASE||'/2023/03/Tiny-Office-1.png','Tiny Office – exterior','Exterior',true,0);

-- ══ COLEGIO INGENIEROS ═════════════════════════════
INSERT INTO projects (slug,title,location,architect,year,description)
VALUES ('colegio-de-ingenieros-agronomos-ampliacion','Colegio de Ingenieros Agrónomos (Ampliación)','San José, Costa Rica','Arq. Alejandro Vargas','2022',
  'Ampliación institucional diseñada para responder a las necesidades actuales del gremio.')
RETURNING id INTO pid;
INSERT INTO project_images(project_id,src,alt,caption,is_primary,sort_order) VALUES
(pid,BASE||'/2023/03/Colegio-de-Ingenieros-Agronomos-1.png','CIA Ampliación – exterior','Exterior',true,0);

-- ══ CASA VARGAS ════════════════════════════════════
INSERT INTO projects (slug,title,location,architect,year,description)
VALUES ('casa-vargas','Casa Vargas','Costa Rica','Juan Vargas Montes de Oca','2022',
  'Residencia familiar de diseño clásico-moderno, con amplios espacios sociales.')
RETURNING id INTO pid;
INSERT INTO project_images(project_id,src,alt,caption,is_primary,sort_order) VALUES
(pid,BASE||'/2023/03/Casa-Vargas-1.png','Casa Vargas – exterior','Exterior',true,0);

-- ══ CASA GIRÓN BECKLES ═════════════════════════════
INSERT INTO projects (slug,title,location,architect,year,description)
VALUES ('casa-giron-beckles','Casa Girón Beckles','Costa Rica','Karhol Rodriguez G.','2022',
  'Proyecto residencial con fusión de estilos contemporáneo y tropical costarricense.')
RETURNING id INTO pid;
INSERT INTO project_images(project_id,src,alt,caption,is_primary,sort_order) VALUES
(pid,BASE||'/2023/03/Casa-Giron-Beckles-1.png','Casa Girón Beckles – exterior','Exterior',true,0),
(pid,BASE||'/2024/02/fachada-render_3-Photo-scaled.jpg','Casa Girón Beckles – render 1','Render 1',false,1),
(pid,BASE||'/2024/02/fachada-render_5-Photo-scaled.jpg','Casa Girón Beckles – render 2','Render 2',false,2),
(pid,BASE||'/2024/02/fachada-render_4-Photo-scaled.jpg','Casa Girón Beckles – render 3','Render 3',false,3),
(pid,BASE||'/2024/02/fachada-render_1-Photo-scaled.jpg','Casa Girón Beckles – render 4','Render 4',false,4);

-- ══ HOTEL COROBICÍ ═════════════════════════════════
INSERT INTO projects (slug,title,location,architect,year,description)
VALUES ('hotel-corobici','Hotel Corobicí','San José, Costa Rica','Arq. Alejandro Vargas','2021',
  'Remodelación y modernización de las instalaciones del reconocido hotel capitalino.')
RETURNING id INTO pid;
INSERT INTO project_images(project_id,src,alt,caption,is_primary,sort_order) VALUES
(pid,BASE||'/2023/03/Hotel-Corobici-1.png','Hotel Corobicí – exterior','Exterior',true,0);

-- ══ CASA CLARA MÜLLER ══════════════════════════════
INSERT INTO projects (slug,title,location,architect,year,description)
VALUES ('casa-clara-muller','Casa Clara Müller','Costa Rica','Arq. Alejandro Vargas','2021',
  'Vivienda unifamiliar de estilo contemporáneo europeo adaptado al trópico.')
RETURNING id INTO pid;
INSERT INTO project_images(project_id,src,alt,caption,is_primary,sort_order) VALUES
(pid,BASE||'/2023/03/Casa-Clara-Muller-1.png','Casa Clara Müller – exterior','Exterior',true,0);

-- ══ ESCUELA PANAMERICANA II ═════════════════════════
INSERT INTO projects (slug,title,location,architect,year,description)
VALUES ('escuela-panamericana-ii','Escuela Panamericana II','Costa Rica','Juan Vargas Montes de Oca','2021',
  'Segunda etapa de construcción de la sede educativa, con enfoque en sostenibilidad.')
RETURNING id INTO pid;
INSERT INTO project_images(project_id,src,alt,caption,is_primary,sort_order) VALUES
(pid,BASE||'/2023/03/Escuela-Panamericana-II-1.png','Escuela Panamericana II – exterior','Exterior',true,0);

-- ══ CASA IBETH CASTRO ══════════════════════════════
INSERT INTO projects (slug,title,location,architect,year,description)
VALUES ('casa-ibeth-castro','Casa Ibeth Castro','Costa Rica','Karhol Rodriguez G.','2020',
  'Residencia diseñada con atención especial a los detalles de interiores y materialidad.')
RETURNING id INTO pid;
INSERT INTO project_images(project_id,src,alt,caption,is_primary,sort_order) VALUES
(pid,BASE||'/2023/03/Casa-Ibeth-Castro-1.png','Casa Ibeth Castro – exterior','Exterior',true,0);

-- ══ CENTRO JUVENIL AMIGÓ ═══════════════════════════
INSERT INTO projects (slug,title,location,architect,year,description)
VALUES ('centro-juvenil-amigo','Centro Juvenil Amigó','Costa Rica','Arq. Alejandro Vargas','2019',
  'Diseño y construcción de espacio comunitario orientado al desarrollo de la juventud costarricense.')
RETURNING id INTO pid;
INSERT INTO project_images(project_id,src,alt,caption,is_primary,sort_order) VALUES
(pid,BASE||'/2023/03/Centro-Juvenil-Amigo-1.png','Centro Juvenil Amigó – exterior','Exterior',true,0);

END $$;
