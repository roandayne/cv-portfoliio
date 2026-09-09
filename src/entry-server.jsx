import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App.jsx';
import './styles/base.css';

export { ROUTE_PATHS } from './meta';
export { metaFor } from './meta';
export { SITE_URL } from './data/site';
export { llmsText } from './llms';

export function render(url) {
  return renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </React.StrictMode>,
  );
}
