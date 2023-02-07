import UrlPattern from 'url-pattern';
import queryString from 'query-string';
import Router from 'next/router';
import routeService from '@src/services/routeService'
import authService from "@root/src/services/authService"
import auth from '@src/helpers/auth'

let routeData = {
  key: 0,
  data: {}
}

export const getRouteData = async (ctx?) => {
  const authInfo = auth(ctx)
  //cache routeData by userId
  if (routeData.key == authInfo.user.id) {
    return routeData.data
  }

  let result = await routeService().withAuth(ctx).getRouteData()
  routeData = {
    key: authInfo.user.id,
    data: result
  }
  return result
}

export const makeUrl = (name, params, routeConfig?): { as: string, href: string } => {
  //try get route from cache
  if (!routeConfig) {
    if (routeData.data) routeConfig = routeData.data;
    else throw new Error("You must call getRouteData first.");
  }

  let routeInfo = routeConfig[name]
  if (!routeInfo) routeInfo = { url: name, action: "" };

  let pattern = new UrlPattern(routeInfo.url);
  let query = queryString.stringify(params)

  try {
    let asUrl = pattern.stringify(params) //link hiển thị trên trình duyệt
    let href = asUrl //link thật trong /pages

    if (routeInfo.action.substr(0, 6) === "pages/") {
      href = routeInfo.action.substr(5)
      if (href.indexOf('?') === -1) {
        href += `?${query}`
      } else {
        href += `&${query}`
      }
    }
    return {
      as: asUrl,
      href: href
    }
  } catch (e) {
    // console.error(e)
    throw e
  }
}

export const addQuery = (query, shallow = true) => {
  if (!process.browser) return;
  let asPath = window.location.pathname
  let oldQuery = Router.router.query
  let queryObj = {
    ...oldQuery,
    ...query
  }
  if (JSON.stringify(queryObj) == JSON.stringify(oldQuery)) return;

  /* if (shallow) {
    const queryString = new URLSearchParams(queryObj).toString();
    console.log(queryString)
    window.history.pushState("", "", `?${queryString}`)
    return;
  } */
  Router.push({
    pathname: Router.router.pathname,
    query: queryObj,
  }, {
    pathname: asPath,
    query: queryObj
  }, {
    //shallow
  })
}

export const getSidebarSelecteds = async (routeName, routes, routeConfig = {}, routePaths = []) => {
  if (!Object.values(routeConfig).length) routeConfig = await getRouteData()
  let sidebarSelectedName = routeConfig[routeName] ? routeConfig[routeName].sidebar : undefined

  if (!routes) return []

  for (let route of routes) {
    if (route.routeName === sidebarSelectedName) {
      routePaths.push(route)
      return routePaths
    } else if (route.children) {
      let result = await getSidebarSelecteds(sidebarSelectedName, route.children, routeConfig, [...routePaths, route])
      if (result && result.length) return result
    }
  }
}

export const getBreadcrumbs = async (routeName): Promise<any[]> => {
  const routeConfig = await getRouteData()
  let result = []
  const route = routeConfig[routeName] ? routeConfig[routeName] : undefined

  if (route) {
    result.unshift(route);

    if (route.parent) {
      let parent = await getBreadcrumbs(route.parent);
      result = [...parent, ...result]
    }
  }

  return result
}
