module.exports = {
  /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
  apps: [{
    name: 'ykgov-hsif-api',
    script: './server.js',
    watch: ['index.ts', './package.json', './controllers'],
    merge_logs: true,
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    }
  }]
};
