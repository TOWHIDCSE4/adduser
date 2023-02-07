import React, { useState } from 'react'
import { Card, Col, Form, Row, Statistic } from 'antd';
import Item from 'antd/lib/list/Item';
import WrapperStatistic from 'antd/lib/statistic/Statistic';

const OverviewForm = () => {

    return <>
        <Form.Item>
            <Row gutter={16}>
                <Col span={12}>
                    <Card>
                        <Row gutter={16}>
                            <Col span={6}>
                                <Statistic
                                title= "Submitted"
                                value= {15}
                                />
                            </Col>
                            <Col span={6}>
                                <Statistic
                                title= "Submitted"
                                value= {15}
                                />
                            </Col>
                            <Col span={6}>
                                <Statistic
                                title= "Submitted"
                                value= {15}
                                />
                            </Col>
                            <Col span={6}>
                                <Statistic
                                title= "Submitted"
                                value= {15}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card>
                        <Statistic
                        title="Draft"
                        value={3}
                        />
                    </Card>
                </Col>
            </Row>
        </Form.Item>
    </>
}

export default OverviewForm