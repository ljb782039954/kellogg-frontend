import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 模拟 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENV_PATH = path.resolve(__dirname, '../.env');
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');

// 简单的 .env 解析器
function loadEnv() {
  const env = {};
  if (fs.existsSync(ENV_PATH)) {
    const content = fs.readFileSync(ENV_PATH, 'utf-8');
    content.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let value = match[2] || '';
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        env[match[1]] = value.trim();
      }
    });
  }
  return env;
}

const env = loadEnv();
const SITE_URL = env.VITE_SITE_URL || 'https://kelloggfashion.com';
const API_BASE = env.VITE_API_BASE_URL || 'https://kellogg-api.aimeexiang239.workers.dev';

async function generateSitemap() {
  console.log('--- Starting Sitemap Generation ---');
  console.log(`Site URL: ${SITE_URL}`);
  console.log(`API Base: ${API_BASE}`);

  const urls = [];

  try {
    // 1. 定义核心页面结构
    console.log('Generating entries for primary pages (Bilingual)...');
    const basePages = [
      { path: '', priority: '1.0', changefreq: 'daily' },
      { path: '/products', priority: '0.9', changefreq: 'weekly' },
      { path: '/about', priority: '0.7', changefreq: 'monthly' },
      { path: '/faq', priority: '0.6', changefreq: 'monthly' },
      // SEO GEO 战略着陆页矩阵
      { path: '/usa-heavyweight-hoodie-manufacturer', priority: '0.9', changefreq: 'weekly' },
      { path: '/uk-streetwear-clothing-manufacturer', priority: '0.9', changefreq: 'weekly' },
      { path: '/canada-blank-apparel-supplier', priority: '0.9', changefreq: 'weekly' },
      { path: '/australia-heavyweight-tshirt-supplier', priority: '0.9', changefreq: 'weekly' },
      // { path: '/germany-streetwear-manufacturer', priority: '0.9', changefreq: 'weekly' },
      // { path: '/europe-blank-clothing-wholesale', priority: '0.9', changefreq: 'weekly' },
    ];

    // const languages = ['', '/zh']; // 空字符串代表默认英文，/zh 代表中文
    const languages = ['']; // 空字符串代表默认英文，没有zh

    basePages.forEach(page => {
      languages.forEach(lang => {
      urls.push({
          loc: `${SITE_URL}${lang}${page.path}`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: page.changefreq,
        priority: page.priority
      });
    });
    });

    // 4. 生成 XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    // 5. 写入文件
    if (!fs.existsSync(PUBLIC_DIR)) {
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }
    fs.writeFileSync(SITEMAP_PATH, xml);
    console.log(`Successfully generated sitemap with ${urls.length} URLs at ${SITEMAP_PATH}`);

  } catch (error) {
    console.error('Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
