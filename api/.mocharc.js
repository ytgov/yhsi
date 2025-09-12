module.exports = {
  require: ['./register.js', './tests/test-setup.js'],
  reporter: 'dot',
  watch: true,
  watchFiles: ['.'],
  ui: 'bdd-lazy-var/global',
};
