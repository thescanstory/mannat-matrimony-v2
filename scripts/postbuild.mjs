import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (fs.existsSync(indexHtmlPath)) {
  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  
  const staticRoutes = [
    'app',
    'auth',
    'login',
    'register',
    'onboarding',
    'privacy',
    'terms',
    'eula',
    'guidelines',
    'account-deletion',
    'deletion',
    'support',
    'contact',
    'review',
    'app-review'
  ];

  for (const route of staticRoutes) {
    const routeDir = path.join(distDir, route);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    fs.writeFileSync(path.join(routeDir, 'index.html'), indexHtml, 'utf8');
  }

  // Also create root 404.html pointing to indexHtml so Vercel 404 fallback automatically serves the app
  fs.writeFileSync(path.join(distDir, '404.html'), indexHtml, 'utf8');

  console.log(`Successfully generated static entry points and 404.html fallback for ${staticRoutes.length} routes.`);
} else {
  console.warn('dist/index.html not found, skipping postbuild route generator.');
}
