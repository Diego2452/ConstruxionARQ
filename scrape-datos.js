// scrape-datos.js — scrape completo de metadata + imágenes
// Corré con: node scrape-datos.js

const { parse } = require('node-html-parser');

const PROJECTS = [
  { slug: 'casa-parrita',                               url: 'https://construxionarq.com/casa-parrita/' },
  { slug: 'condominio-escazu-01',                       url: 'https://construxionarq.com/condominio-escazu-01/' },
  { slug: 'casa-salgado',                               url: 'https://construxionarq.com/casa-salgado/' },
  { slug: 'casa-sierra',                                url: 'https://construxionarq.com/casa-sierra/' },
  { slug: 'tiny-home',                                  url: 'https://construxionarq.com/tiny-home/' },
  { slug: 'tiny-office',                                url: 'https://construxionarq.com/tiny-office/' },
  { slug: 'colegio-de-ingenieros-agronomos-ampliacion', url: 'https://construxionarq.com/colegio-de-ingenieros-agronomos-ampliacion/' },
  { slug: 'casa-vargas',                                url: 'https://construxionarq.com/casa-vargas/' },
  { slug: 'casa-giron-beckles',                         url: 'https://construxionarq.com/casa-giron-beckles/' },
  { slug: 'hotel-corobici',                             url: 'https://construxionarq.com/hotel-corobici/' },
  { slug: 'casa-clara-muller',                          url: 'https://construxionarq.com/casa-clara-muller/' },
  { slug: 'escuela-panamericana-ii',                    url: 'https://construxionarq.com/escuela-panamericana-ii/' },
  { slug: 'casa-ibeth-castro',                          url: 'https://construxionarq.com/casa-ibeth-castro/' },
  { slug: 'centro-juvenil-amigo',                       url: 'https://construxionarq.com/centro-juvenil-amigo/' },
];

// URLs to exclude (logo, avatars, etc.)
const EXCLUDE = [
  'construxionARQ-transparente-white-rebuild-AI',
  'cropped-con-logo',
  'gravatar.com',
];

function isValidImg(url) {
  if (!url) return false;
  if (!url.includes('construxionarq.com/wp-content/uploads')) return false;
  if (url.match(/-\d+x\d+\.(jpg|jpeg|png|webp)$/i)) return false; // thumbnails
  if (EXCLUDE.some(ex => url.includes(ex))) return false;
  return true;
}

function extractImages(root) {
  const seen = new Set();
  const imgs = [];
  root.querySelectorAll('img').forEach(el => {
    ['src', 'data-src', 'data-lazy-src', 'data-original'].forEach(attr => {
      const url = el.getAttribute(attr);
      if (isValidImg(url) && !seen.has(url)) {
        seen.add(url);
        imgs.push(url);
      }
    });
  });
  return imgs;
}

// Pair labels (h5) with values (.elementor-icon-box-description) per inner-section
function extractMeta(root) {
  const meta = {};
  const sections = root.querySelectorAll('.elementor-inner-section');

  sections.forEach(section => {
    const label = section.querySelector('h5')?.text.trim().toLowerCase() ?? '';
    const value = section.querySelector('.elementor-icon-box-description')?.text.trim() ?? '';
    if (!label || !value || value === '-') return;

    if (label.includes('location'))    meta.location    = value;
    else if (label.includes('project manager') || label.includes('manager')) meta.manager = value;
    else if (label.includes('architect'))  meta.architect   = value;
    else if (label.includes('dimension') || label.includes('dimensi')) meta.dimensions = value;
    else if (label.includes('descrip'))    meta.description = value;
    else if (label.includes('year') || label.includes('año')) meta.year = value;
  });

  return meta;
}

async function scrape(project) {
  try {
    const res  = await fetch(project.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const root = parse(html);

    // Title
    const title = root.querySelector('h1.page-title')?.text.trim() ?? project.slug;

    // Year from publication date
    const dateEl = root.querySelector('time[datetime]');
    const year   = dateEl?.getAttribute('datetime')?.slice(0, 4) ?? '';

    // Hero
    const heroEl = root.querySelector('.hero-section img');
    const hero   = heroEl?.getAttribute('src') ?? '';

    // All valid images (excluding logo etc.)
    const allImgs = extractImages(root);
    const gallery = allImgs.filter(url => url !== hero);

    // Structured meta
    const meta = extractMeta(root);
    if (year && !meta.year) meta.year = year;

    return { slug: project.slug, title, hero, gallery, meta };
  } catch (e) {
    return { slug: project.slug, error: e.message };
  }
}

async function main() {
  console.log('Scraping', PROJECTS.length, 'projects...\n');
  const results = [];

  for (const project of PROJECTS) {
    process.stdout.write(`  → ${project.slug}... `);
    const data = await scrape(project);
    results.push(data);

    if (data.error) {
      console.log(`ERROR: ${data.error}`);
    } else {
      const fields = Object.keys(data.meta).join(', ') || 'no meta';
      console.log(`${data.gallery.length} gallery imgs | meta: ${fields}`);
    }
  }

  console.log('\n\n=== RESULTS (paste this to Claude) ===\n');
  console.log(JSON.stringify(results, null, 2));
}

main();