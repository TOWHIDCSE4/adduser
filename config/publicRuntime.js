const config = {
  API_HOST: process.env.API_HOST,
  LOGO: process.env.LOGO,
  FAVICON: process.env.FAVICON,
  DEFAULT_LANG: process.env.DEFAULT_LANG,
  SITE_NAME: "App_platform",
  DISABLE_2FA: process.env.DISABLE_2FA,
  VERSION: process.env.VERSION,
  DOMAIN: process.env.DOMAIN,
  LABEL2FA: process.env.LABEL2FA || "App_platform",
};

module.exports = config
