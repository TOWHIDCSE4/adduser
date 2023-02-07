import Head from 'next/head';
import getConfig from 'next/config'
const { publicRuntimeConfig } = getConfig()

const Default = (props: any) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
        <title>{props.title || publicRuntimeConfig.TITLE}</title>
        <meta property="og:title" content={props.title || publicRuntimeConfig.TITLE} />
        <meta property="og:description" content={props.description || publicRuntimeConfig.DESCRIPTION} />
        <link rel="shortcut icon" type="image/png" href={publicRuntimeConfig.FAVICON} />
        <meta property="og:image" content={publicRuntimeConfig.LOGO} />
        <link rel="apple-touch-icon" href={publicRuntimeConfig.LOGO}></link>
      </Head>
      <div id="root">
        <main>
          {/* <div className="toolbar"/> */}
          <div className="content">
            {props.children}
          </div>
        </main>
      </div>
    </>
  );
}

export default Default;
