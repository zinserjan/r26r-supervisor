import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { RouterContext, createMemoryHistory } from 'react-router';
import { Provider } from 'react-redux';

import configure from 'r26r-supervisor/lib/configure';
import renderServer from 'r26r-supervisor/lib/server';

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

  const {store, history} = configure({
    reducers,
    history: createMemoryHistory({
      //basename: '',
      entries: url
    })
  });

  const routes = createRoutes(store);

  renderServer({
    store,
    routes,
    history,
    url,
  }, (error, redirectLocation, renderProps, state) => {
    if (error) {
      res.status(500).send(error.stack);
    } else if (redirectLocation) {
      res.redirect(302, redirectLocation.pathname + redirectLocation.search);
    } else if (!renderProps) {
      res.status(404).send('Not found');
    } else {
      const component = (
        <Provider store={store}>
          <RouterContext {...renderProps} />
        </Provider>
      );
      const appHtml = ReactDOMServer.renderToString(component);
      const siteHtml = getHtml(appHtml, state);
      res.status(200).send(siteHtml);
    }
  });
});


export default router;
