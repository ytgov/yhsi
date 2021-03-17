module.exports = {
  /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
  apps: [{
    name: 'ykgov-covid-api',
    script: './server.js',
    watch: ['server.js', './package.json'],
    merge_logs: true,
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
};
