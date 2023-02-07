import { NextPageContext } from "next";
import Error404Page from '@src/components/Errors/404'

const Error = ({ statusCode }) => {
  return <Error404Page statusCode={statusCode} />
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return {
    statusCode,
    namespacesRequired: ['pages', 'buttons', 'common', 'errors']
  };
};

export default Error;