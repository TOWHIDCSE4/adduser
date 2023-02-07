import React from 'react';
import { Row, Col, Divider } from 'antd';

const Profile = () => {
  return <div className="sidebar-profile">
    <Row>
      <div className="profile-avatar">
        <img src="/logo/logo.png" className="avatar" />
      </div>
    </Row>
    <Row>
      <Col xs={22} offset={1}>
        <Divider className="profile-endLine" />
      </Col>
    </Row>
  </div>
}

export default Profile