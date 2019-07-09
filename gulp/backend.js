const gulp = require('gulp');
const { BuildLauncher } = require('./buildLauncher');

gulp.task('backend', (cb) => {
  const build = new BuildLauncher(true);

  build.run(cb);
});
