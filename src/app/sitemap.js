import fs from 'fs';
import path from 'path';

export default function sitemap() {
  const baseUrl = 'https://www.wordtopdfconverter.online';
  
  const appDir = path.join(process.cwd(), 'src/app');
  let files = [];
  try {
    files = fs.readdirSync(appDir);
  } catch (error) {
    console.error("Could not read app directory for sitemap", error);
  }
  
  const routes = files.filter(file => {
    try {
      const stats = fs.statSync(path.join(appDir, file));
      if (stats.isDirectory()) {
        const hasPage = fs.existsSync(path.join(appDir, file, 'page.jsx')) || fs.existsSync(path.join(appDir, file, 'page.tsx'));
        const excluded = ['api'];
        return hasPage && !excluded.includes(file);
      }
    } catch(e) {
      return false;
    }
    return false;
  });

  const sitemapUrls = routes.map(route => ({
    url: `${baseUrl}/${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Add the root URL at the top
  sitemapUrls.unshift({
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  });

  return sitemapUrls;
}
