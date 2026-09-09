import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_URL } from './data/site';
import { metaFor } from './meta';

function setTag(selector, create, value) {
  if (!value) return;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  if (el.tagName === 'LINK') el.setAttribute('href', value);
  else el.setAttribute('content', value);
}

/**
 * Keeps the document head in sync on client-side navigation. The initial
 * values are already in the prerendered HTML, so this only matters after a
 * route change.
 */
export default function useMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = metaFor(pathname);
    const canonical = `${SITE_URL}${pathname === '/' ? '/' : pathname.replace(/\/$/, '')}`;

    document.title = meta.title;
    setTag('meta[name="description"]', () => {
      const el = document.createElement('meta');
      el.setAttribute('name', 'description');
      return el;
    }, meta.description);
    setTag('link[rel="canonical"]', () => {
      const el = document.createElement('link');
      el.setAttribute('rel', 'canonical');
      return el;
    }, canonical);
    setTag('meta[property="og:title"]', () => {
      const el = document.createElement('meta');
      el.setAttribute('property', 'og:title');
      return el;
    }, meta.title);
    setTag('meta[property="og:description"]', () => {
      const el = document.createElement('meta');
      el.setAttribute('property', 'og:description');
      return el;
    }, meta.description);
    setTag('meta[property="og:url"]', () => {
      const el = document.createElement('meta');
      el.setAttribute('property', 'og:url');
      return el;
    }, canonical);
    // A route reached by client-side navigation has to correct the robots
    // directive too: the prerendered / carries "index, follow", and landing
    // on an unknown path from there must not leave that in place.
    setTag('meta[name="robots"]', () => {
      const el = document.createElement('meta');
      el.setAttribute('name', 'robots');
      return el;
    }, meta.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');
  }, [pathname]);
}
