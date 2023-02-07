import React from 'react'
import { Form, Input, Col, Row, Select } from 'antd';
import useBaseHook from '@src/hooks/BaseHook'
import validatorHook from '@src/hooks/ValidatorHook';

const { Option } = Select

const PhoneNumberForm = ({ prefix }: { prefix: string }) => {
  const { t } = useBaseHook();
  const { phoneNumberSGP } = validatorHook()
  const types = [
    { label: t("pages:mnoDB.types.nr"), value: 'NR' },
    { label: t("pages:mnoDB.types.chatbot"), value: 'ChatBot' }
  ]

  const renderPhoneNumber = (i: number, width: number) => {
    return <Form.Item
      name={[prefix, i, "phoneNumber"]}
      noStyle={width === 50 ? true : false}
      rules={[
        phoneNumberSGP({ message: t('messages:form.invalidPhoneNumber') })
      ]}
    >
      <Input
        style={{ width: `${width}%` }}
        placeholder={t("pages:mnoDB.table.phoneNumber")}
        maxLength={8}
      />
    </Form.Item>
  }

  const renderItem = () => {
    let items = []
    for(let i = 0; i <= 9; i++) {
      items.push(
        <Col md={12} key={i}>
          {prefix !== "mno" ? renderPhoneNumber(i, 100) : null}
          {prefix === "mno" ? (
            <Form.Item>
              <Input.Group compact>
                {renderPhoneNumber(i, 50)}
                <Form.Item
                  name={[prefix, i, 'voice']}
                  noStyle
                >
                  <Select style={{ width: '50%' }} placeholder={t('pages:mnoDB.table.voice')}>
                    {types.map((item: any, index: number)=> <Option key={index} value={item.value}>{item.label}</Option>)}
                  </Select>
                </Form.Item>
              </Input.Group>
            </Form.Item>
          ): null}
        </Col>
      )
    }
    return items
  }

  return <Row gutter={[12, 12]}>
    {renderItem()}
  </Row>
}

export default PhoneNumberForm
