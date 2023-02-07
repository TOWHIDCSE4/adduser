const rootDir = process.cwd();

const config = {
  MAXSIZE: '100m', //100MB
  MAXFILES: '30d', //30 ngày
  DATE_PATTERN: 'YYYY-MM-DD',
  DIRNAME: `${rootDir}/logs/`
};

export default config