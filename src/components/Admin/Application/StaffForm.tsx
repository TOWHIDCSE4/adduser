import { Checkbox, Form, Input } from "antd"
import React from 'react'

interface FormStaffInsurance{
    label: string,
    name: string,
    type: 'text' | 'number' | 'date'|'textArea',
    width?: number
}

interface FakeData {
    name: string,
    items: [FormStaffInsurance]
}

const StaffForm = ({ fakeData } : { fakeData: FakeData }) => {

    const renderFormItems = (items: [FormStaffInsurance]) => {
        return items.map((item) => {
            return <div style={{ width: item.width || 200 }}>
                <Form.Item name={item.name} label={item.label}>
                    {item.type === 'text' ? <Input /> : <Checkbox />}
                </Form.Item>
            </div>
        })
    }

    return <div className="content">
            {renderFormItems(fakeData.items)}
    </div>
}

export default StaffForm