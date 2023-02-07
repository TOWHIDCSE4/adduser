import React from "react";
import App from "next/app";
import I18n from "@libs/I18n";
import wrapper from "@src/components/Redux";
import "@src/less/base/custom-ant-theme.less";
import "@src/less/base/vars.less";
import "@src/less/default.less";
import "@src/less/login.less";
import "@src/less/admin.less";
import Router from "next/router";
import NProgress from "nprogress"; //nprogress module
import "nprogress/nprogress.css"; //styles of nprogress
//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done(true));
Router.events.on("routeChangeError", () => NProgress.done());

const DefaultComponent = (props: any) => {
  return <>{props.children}</>;
};
class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    let Layout = Component["Layout"] ? Component["Layout"] : DefaultComponent;
    const permissions = Component["permissions"] || {};
    return (
      <Layout permissions={permissions}>
        <Component {...pageProps} />
      </Layout>
    );
  }
}

export default wrapper.withRedux(I18n.appWithTranslation(MyApp));
