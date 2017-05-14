import axios from 'axios';
import { baseRoutes, requireAuth } from './base';

const backEndRouter = fn => {
  axios.get('/data/router.json').then(response => {
    let subRoutes = [];

    for (let value1 of response.data) {
      let route = {
        path: value1.path,
        name: value1.name,
        beforeEnter: requireAuth
      };

      if (typeof value1.children !== 'undefined') {
        switch (value1.path) {
          case '/user':
            route.component = resolve => require(['../views/user/' + value1.component], resolve);

            route.children = [];
            for (let value2 of value1.children) {
              let subRoute = {
                path: value2.path,
                name: value2.name,
                component: resolve => require(['../views/user/' + value2.component], resolve)
              };
              route.children.push(subRoute);
            }
            break;
        }
      } else {
        route.component = resolve => require(['../views/' + value1.component], resolve);
      }

      subRoutes.push(route);
    }

    const routes = baseRoutes.concat(subRoutes);

    fn(routes);
  }).catch(error => {
    console.log(error);
  });
};

export default backEndRouter;