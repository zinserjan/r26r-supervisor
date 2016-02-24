import express from 'express';
import { renderToString } from 'react-dom/server';
import { createStore }from 'r26r-supervisor';
import renderServer from 'r26r-supervisor/lib/server';
import { useRouterHistory, createMemoryHistory } from 'react-router';

import createRoutes from './routes/createRoutes';
import * as reducers from './reducers';

const router = express.Router(); // eslint-disable-line new-cap

const getHtml = (html = '', data = {}) => { // eslint-disable-line arrow-body-style
  return (
    `<!DOCTYPE html>
    <html>
      <body>
        <div id="app">${html}</div>
        <div id="dev"></div>
        <script type="text/javascript">
          window.__data = ${JSON.stringify(data)};
        </script>
        <script src="/bundle.js"></script>
      </body>
    </html>`
  );
};

router.use((req, res) => {
  const url = req.url;

  const history = useRouterHistory(createMemoryHistory)({
    basename: '',
  });

  const store = createStore({
    reducers,
    history,
  });

  const routes = createRoutes(store);

  renderServer({
    store,
    routes,
    history,
    url,
  }, (error, redirectLocation, component, state) => {
    if (error) {
      res.status(500).send(error.stack);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (!component) {
      res.status(404).send('Not found');
    } else {
      const appHtml = renderToString(component);
      const siteHtml = getHtml(appHtml, state);
      res.status(200).send(siteHtml);
    }
  });
});


export default router;
