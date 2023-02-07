import React, { useState, useEffect } from 'react';
import { Menu, Spin } from 'antd';
import sidebar from './slidebar.config';
import useBaseHook from '@src/hooks/BaseHook'
import Link from 'next/link';
import useSWR from 'swr'
import Cookies from 'universal-cookie'
import usePermissionHook from '@src/hooks/PermissionHook'
import { makeUrl, getSidebarSelecteds, getRouteData } from '@src/helpers/routes'
import auth from '@src/helpers/auth'
import UrlPattern from 'url-pattern';

const { SubMenu } = Menu

const MenuComponent = (props: any) => {
  const { router, t, getCookies } = useBaseHook({ lang: ['menu'] })
  const { query } = router
  const cookieObject = getCookies()
  const cookies = new Cookies(cookieObject)
  const { theme, onCollapseChange, isMobile, tReady, type, ...otherProps } = props
  const { checkPermission } = usePermissionHook()
  const [routerNames, setRouterNames] = useState(undefined)
  const { data: routeData } = useSWR(["getRouteData"], () => getRouteData());

  const getRouteName = () => {
    const routePath = router.pathname
    for (let routeName in routeData) {
      let routeElement = routeData[routeName]
      if (!routeElement.action) continue;
      if (routeElement.action.substr(5) === routePath) return routeName
    }
  }

  const currentRouteName = getRouteName()
  const { data: breadcums } = useSWR(Object.values(routeData || {}).length ? ["getSidebarSelecteds", currentRouteName, sidebar, routeData] : null, () => getSidebarSelecteds(currentRouteName, sidebar, routeData));
  useEffect(() => {
    let routerNamesT = (breadcums || []).map((breadcum: any) => breadcum.routeName)
    setRouterNames(routerNamesT)
  }, [breadcums])

  const generateMenus = (data: any) => {
    return data.map((item: any) => {
      if (item.children) {
        if (item.type === "group") {
          let children = generateMenus(item.children)
          if (!children.length) return;
          return (
            <Menu.ItemGroup
              key={item.routeName}
              title={
                <>
                  {item.icon ? item.icon : ''}
                  <span>{t(item.routeName)}</span>
                </>
              }
            >
              {children}
            </Menu.ItemGroup>
          );
        }
        else {
          let children = generateMenus(item.children)
          if (!children.length) return;
          return (
            <SubMenu
              key={item.routeName}
              title={
                <>
                  {item.icon ? item.icon : ''}
                  <span>{t(item.routeName)}</span>
                </>
              }
            >
              {children}
            </SubMenu>
          );
        }
      }

      if (!checkPermission(item.permissions)) return
      let pattern = new UrlPattern(routeData[currentRouteName].url);
      let queryT = { ...query, ...pattern.match(window.location.pathname) }
      let routeParams = { ...item.routeParams, ...queryT }
      // if (queryT.botId) {
      //   cookies.remove('botId', { path: "/" })
      //   cookies.set('botId', queryT.botId, { path: "/" })
      // }
      // if (cookies.get('botId')) routeParams = { ...routeParams, botId: cookies.get('botId') }
      let routeInfo = makeUrl(item.routeName, routeParams, routeData || {})
      const routeLang = {
        href: routeInfo.href || "",
        as: routeInfo.as || ""
      }
      return (
        <Menu.Item key={item.routeName}>
          <Link {...routeLang} >
            <a href={routeLang.as}>
              {item.icon ? item.icon : ''}
              <span>{t(item.routeName)}</span>
            </a>
          </Link>
        </Menu.Item>
      );
    }).filter((menu: any) => menu);
  }

  if (!routerNames || routerNames.length == 0) return <Spin className="spin" />

  return <Menu
    mode="inline"
    theme={theme}
    className="side-bar"
    defaultOpenKeys={routerNames}
    selectedKeys={[...routerNames].pop()}
    onClick={
      isMobile
        ? () => {
          onCollapseChange(true)
        }
        : undefined
    }
    {...otherProps}
  >
    {generateMenus(sidebar)}
  </Menu>
}

export default MenuComponent
