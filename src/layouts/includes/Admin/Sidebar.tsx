
import React from 'react';
import { Layout, Row, Col } from 'antd';
import Menu from './Menu'
const THEME = 'light'

const { Sider } = Layout;
import Profile from './Profile'

const sideBar = (props: any) => {
  const { collapsed, onCollapseChange, isMobile, theme, type } = props
  return (
    <Sider
      width={256}
      collapsedWidth={0}
      trigger={null}
      breakpoint="lg"
      theme={THEME}
      collapsible
      collapsed={collapsed}
      onBreakpoint={!isMobile ? onCollapseChange: null}
    >
      <div>
        <Row>
          <Col span={24}>
            <Profile />
          </Col>
        </Row>
      </div>
      <Menu
        theme={theme}
        onCollapseChange={onCollapseChange}
        isMobile={isMobile}
        type={type}
      />
    </Sider>
  );
}

export default sideBar;
