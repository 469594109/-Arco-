import { appRoutes, appExternalRoutes } from '../routes';

const mixinRoutes = [...appRoutes, ...appExternalRoutes];

const appClientMenus = mixinRoutes.map((el) => {
  const { name, path, meta, redirect, children } = el;
  return {
    name,
    path,
    meta,
    redirect,
    children,
  };
});
// console.log(appClientMenus);
const temMenu = appClientMenus.find(v=>v.path === '/index')?.children.map((el) => {
  const { name, path, meta, redirect, children } = el;
  return {
    name,
    path,
    meta,
    redirect,
    children,
  };
});

// console.log(temMenu);
// debugger;

export default temMenu;
// export default appClientMenus;
