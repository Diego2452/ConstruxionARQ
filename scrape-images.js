// scrape-images.js
// Corré con: node scrape-images.js

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

function isFullSize(url) {
  return url && !url.match(/-\d+x\d+\.(jpg|jpeg|png|webp)$/i);
}

function extractImages(root) {
  const seen = new Set();
  const imgs = [];
  root.querySelectorAll('img').forEach(el => {
    ['src','data-src','data-lazy-src','data-original'].forEach(attr => {
      const url = el.getAttribute(attr);
      if (url && isFullSize(url) && url.includes('construxionarq.com/wp-content/uploads') && !seen.has(url)) {
        seen.add(url);
        imgs.push(url);
      }
    });
  });
  return imgs;
}

async function scrape(project) {
  try {
    const res  = await fetch(project.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const root = parse(html);

    const heroEl = root.querySelector('.hero-section img, .ct-media-container img');
    const hero   = heroEl?.getAttribute('src') ?? '';
    const allImgs = extractImages(root);
    const gallery = allImgs.filter(url => url !== hero);
    const metaEls = root.querySelectorAll('.elementor-icon-box-description');
    const meta    = metaEls.map(el => el.text.trim()).filter(v => v && v !== '-');
    const title   = root.querySelector('h1.page-title')?.text.trim() ?? project.slug;

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
      console.log(`hero + ${data.gallery.length} gallery images`);
    }
  }
  console.log('\n\n=== RESULTS (paste this to Claude) ===\n');
  console.log(JSON.stringify(results, null, 2));
}

main();