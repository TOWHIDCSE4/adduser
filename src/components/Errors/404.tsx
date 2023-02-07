import React from 'react'
import Layout from '@src/layouts/Default'
import useBaseHook from "@src/hooks/BaseHook";
import { Result, Button } from 'antd';

const Error = ({ statusCode = 404 }: { statusCode: number }) => {
  const { t, router } = useBaseHook();

  return (
    <Layout title={t(`pages:errors.${statusCode}.title`)}>
      <Result
        status="404"
        title={t(`pages:errors.${statusCode}.notfound`)}
        subTitle={t(`pages:errors.${statusCode}.content`)}
        extra={<Button onClick={() => router.back()} type="primary">Back Home</Button>}
      />
    </Layout>
  )
}

export default Error
