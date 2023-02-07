import { Breadcrumb } from "antd";
import { makeUrl, getBreadcrumbs, getRouteData } from '@src/helpers/routes'
import Link from "next/link";
import useBaseHook from "@src/hooks/BaseHook";
import { HomeFilled } from "@ant-design/icons";
import useSWR from 'swr'

const BreadCrumbComponent = () => {
  const { router, t } = useBaseHook({ lang: ["menu"] });
  const { data: routeData } = useSWR(["getRouteData"], () => getRouteData());
  const { query } = router

  const getRouteName = () => {
    const routePath = router.pathname;
    for (let routeName in routeData) {
      let routeElement = routeData[routeName];
      if (!routeElement.action) continue;
      if (routeElement.action.substr(5) === routePath) return routeName;
    }
  };

  let breadCumbs = [];
  const routeName = getRouteName();
  const { data: routes } = useSWR(routeName ? ["getBreadcrumbs", routeName] : null, () => getBreadcrumbs(routeName));
  if (routes && routes[0].name != `frontend.admin.dashboard`) {
    routes.unshift({
      name: `frontend.admin.dashboard`,
    });
  }

  for (let route of routes || []) {
    try {
      let linkProps = makeUrl(route.name, { botId: query.botId }); //add id example
      breadCumbs.push(
        <Breadcrumb.Item key={route.name}>
          <Link {...linkProps}>
            <a>
              {route.name == `frontend.admin.dashboard` ? (
                <HomeFilled />
              ) : (t(route.name))}
            </a>
          </Link>
        </Breadcrumb.Item>
      );
    } catch (e) {
      breadCumbs.push(
        <Breadcrumb.Item key={route.name}>{t(`menu:${route.name}`)}</Breadcrumb.Item>
      );
    }
  }

  return <Breadcrumb>{breadCumbs}</Breadcrumb>;
};

export default BreadCrumbComponent;