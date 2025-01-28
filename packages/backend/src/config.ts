export const DevHubConfig = {
  wellKnownApiPath: '/.well-known/openid-configuration',
  logFileConfig: {
    filename: 'tibco-hub-%DATE%.log',
    zippedArchive: false,
    dirname: '/tmp/logs',
    maxSize: '20m',
    maxFiles: '1d',
    datePattern: 'YYYY-MM-DD',
  },
};
