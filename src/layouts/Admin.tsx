import React, { useState, useEffect, Fragment } from "react";
import { Layout, Drawer, BackTop, Row, Col, Typography } from "antd";
import useBaseHooks from "@src/hooks/BaseHook";
import usePermissionHook from "@src/hooks/PermissionHook";
import { getRouteData } from '@src/helpers/routes'

import Head from 'next/head';
import dynamic from 'next/dynamic';
import getConfig from 'next/config';
import useSWR from 'swr'
import Error403 from '@src/components/Errors/403'

const Sidebar = dynamic(() => import('./includes/Admin/Sidebar'), { ssr: false })
const Header = dynamic(() => import('./includes/Admin/Header'), { ssr: false })
const BreadCrumb = dynamic(() => import('@src/components/BreadCrumb'), { ssr: false })

const THEME ="dark";
const { publicRuntimeConfig } = getConfig()
const { Title, Text } = Typography;
const { Content, Footer } = Layout;

const Admin = (props: any) => {
  const { router, t, setStore } = useBaseHooks();
  const { checkPermission } = usePermissionHook();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const onCollapseChange = (value: boolean) => {
    setCollapsed(value);
  };

  const updateSize = () => {
    const mobile = window.innerWidth < 992;
    setIsMobile(mobile);
    setStore("isMobile", mobile);
    setCollapsed(false);
  };

  useEffect(() => {
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const getRouteName = async () => {
    const routePath = router.pathname;
    const routeData: any = await getRouteData();
    for (let routeName in routeData) {
      let routeElement = routeData[routeName];
      if (!routeElement.action) continue;
      if (routeElement.action.substr(5) === routePath) return routeName;
    }
  }

  const { data: routeName } = useSWR("getRouteName", () => getRouteName());

  if (!checkPermission(props.permissions || {})) {
    return <Error403 />
  }

  return (
    <Fragment>
      <Head>
        <title>{props.title || publicRuntimeConfig.SITE_NAME || ""}</title>
        <meta property="og:title" content={props.title || publicRuntimeConfig.TITLE || ""} />
        <meta property="og:description" content={props.description || publicRuntimeConfig.DESCRIPTION || ""} />
        <link rel="shortcut icon" type="image/png" href={publicRuntimeConfig.FAVICON} />
        <meta property="og:image" content={publicRuntimeConfig.LOGO} />
        <link rel="apple-touch-icon" href={publicRuntimeConfig.LOGO_IOS}></link>
      </Head>
      <div id="admin">
        <Layout hasSider={true}>
          {isMobile ? (
            <Drawer
              maskClosable
              closable={false}
              destroyOnClose={true}
              onClose={() => onCollapseChange(false)}
              open={collapsed}
              placement="left"
              width={256}
              bodyStyle={{
                padding: 0,
                height: "100vh",
              }}
            >
              <Sidebar
                className="slider"
                onCollapseChange={onCollapseChange}
                theme={THEME}
                isMobile={isMobile}
                type={props.type}
              />
            </Drawer>
          ) : (
            <Sidebar
              className="slider"
              collapsed={collapsed}
              onCollapseChange={onCollapseChange}
              theme={THEME}
              isMobile={isMobile}
              type={props.type}
            />
          )}
          <Layout>
            <div id="primaryLayout"></div>

            <Content className={`main-layout ${collapsed ? "collapsed" : ""}`}>
              <Header collapsed={collapsed} onCollapseChange={onCollapseChange} />
              <div className="breadcumbs">
                <Row>
                  <Col xs={24} lg={12} xl={15}>
                    <Title level={4}>
                      {props.title || t(`pages:${(routeName || "").replace("frontend.admin.", "")}.title`)}
                    </Title>
                    <Text>
                      {props.description || t(`pages:${(routeName || "").replace("frontend.admin.", "")}.description`)}
                    </Text>
                  </Col>
                  <Col xs={24} lg={12} xl={9}>
                    <div className="breadcumb-right">
                      <BreadCrumb />
                    </div>
                  </Col>
                </Row>
              </div>
              {props.children}
            </Content>
            <Footer className="footer">{t("common:copyright", { version: publicRuntimeConfig.VERSION, date: new Date().getFullYear() })}</Footer>            <BackTop
              className={"backTop"}
              target={() =>
                document.querySelector("#primaryLayout") as HTMLElement
              }
            />
          </Layout>
        </Layout>
      </div>
    </Fragment>
  )
}

export default Admin;
