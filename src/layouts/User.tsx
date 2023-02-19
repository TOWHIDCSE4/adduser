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
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

  const onCollapseChange = (value: boolean) => {
    // setCollapsed(true);
  };

  const updateSize = () => {
    const mobile = window.innerWidth < 992;
    setIsMobile(mobile);
    setStore("isMobile", mobile);
    // setCollapsed(true);
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


  return (
    <Fragment>
     
      <div id="admin">
        <Layout hasSider={false}>
          
          <Layout>
            <div id="primaryLayout"></div>

            <Content className={`main-layout ${collapsed ? "collapsed" : ""}`}>
              {/* <Header onCollapseChange={onCollapseChange} /> */}
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
