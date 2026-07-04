# ConstruxionArq — Next.js

Migración de construxionarq.com a Next.js 14 + Tailwind CSS.

---

## ▶ Correr en local (VS Code)

```bash
# 1. Instalar dependencias
npm install

# 2. Correr el servidor de desarrollo
npm run dev

# 3. Abrir en el navegador
# http://localhost:3000
```

---

## 🏗 Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx            ← Homepage (3 secciones Ken Burns)
│   ├── nosotros/           ← Página del equipo
│   ├── proyectos/          ← Listado de proyectos
│   │   └── [slug]/         ← Proyecto individual (template DiRoca)
│   └── contactar/          ← Contacto + mapa
├── components/
│   ├── Navbar.tsx          ← Header de 2 filas + menú mobile
│   ├── Footer.tsx
│   ├── ImageSection.tsx    ← Carousel de imágenes + lightbox
│   └── Lightbox.tsx        ← Modal de imagen ampliada
└── data/
    └── projects.ts         ← DATOS DE LOS 19 PROYECTOS ← editar aquí
```

---

## 📝 Agregar imágenes a los proyectos

Abrí `src/data/projects.ts` y completá los campos vacíos:

```typescript
{
  slug: 'casa-d',
  title: 'Casa No.D',
  heroImage: 'https://construxionarq.com/wp-content/uploads/...', // URL de la imagen principal
  location: 'San José, Costa Rica',
  locationUrl: 'https://maps.google.com/...',
  projectManager: 'Nombre',
  architect: 'Karhol Rodriguez G.',
  dimensions: '250 m²',
  description: 'Descripción del proyecto...',
  sections: [
    {
      title: 'Fachada',
      images: [
        'https://construxionarq.com/wp-content/uploads/.../imagen1.jpg',
        'https://construxionarq.com/wp-content/uploads/.../imagen2.jpg',
        // Podés agregar todas las que quieras — el carousel las maneja solas
      ]
    },
    {
      title: 'Interior',
      images: ['...']
    },
  ]
}
```

---

## 🎬 Agregar el video de scroll-scrub (YouTube Short)

1. Descargá el video como MP4:
   - Usá `yt-dlp https://youtube.com/shorts/6jYQQvHtpLU -o video.mp4`
   - O usá ssyoutube.com
2. Colocá el archivo en `/public/videos/hero.mp4`
3. En `src/app/page.tsx` está el comentario `// TODO: ScrollVideo` — ahí lo integrás con GSAP ScrollTrigger

---

## 🚀 Deploy en SiteGround

```bash
# Generar build estático
npm run build

# La carpeta "out/" contiene HTML/CSS/JS puro
# Subís el CONTENIDO de out/ a public_html/ por FTP
# (no la carpeta out/ en sí, sino lo que hay adentro)
```

**Pasos en SiteGround:**
1. Site Tools → Sitio Web → Gestor archivos → public_html
2. Borrás los archivos de WordPress (wp-admin, wp-content, wp-includes, etc.)
3. Subís todo el contenido de la carpeta `out/`
4. Listo — el sitio corre sin Node.js ni base de datos

> **Nota:** Las imágenes de WordPress siguen en sus URLs originales.
> No necesitás moverlas — el código ya las referencia por URL directa.

---

## 🎨 Cambiar colores / fuentes

Editá `tailwind.config.ts` → sección `colors`:
- `accent: '#C11D2A'` → rojo de hover
- `site-bg: '#151515'` → fondo del sitio
- `header-bg: '#000000'` → fondo del header
