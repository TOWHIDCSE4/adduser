import React from 'react'
import dynamic from 'next/dynamic';
import useBaseHook from '@src/hooks/BaseHook'
import ApplicationForm from '@root/src/components/Admin/Application/ApplicationForm';

const Layout = dynamic(() => import('@src/layouts/Admin'), { ssr: false })

const Index = () => {

  return (
    <div className="content">
      <ApplicationForm />
    </div>
  )
}

Index.Layout = (props) => {
  const { t } = useBaseHook();

  return <Layout
    title={t("pages:application.index.title")}
    description={t("pages:application.index.description")}
    {...props}
  />
}

Index.permissions = {
  "application": "R"
}

export default Index