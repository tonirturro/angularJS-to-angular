const gulp = require('gulp');
const path = require('path');
const electron = require('electron-connect').server.create({
    path: 'dist'
});
  
const electronLaunchFiles = path.resolve(__dirname, '../src/electron-launch/package.json');
const appOutput = path.resolve(__dirname, '../dist');
const frontEndBundle = path.resolve(appOutput, 'bundle.js');
const backEndBundle = path.resolve(appOutput, 'main.js')

gulp.task('electron-launch-files', () => {
    return gulp.src(electronLaunchFiles).pipe(gulp.dest(appOutput));
});

gulp.task('electron-watch', function () {
    electron.start('--remote-debugging-port=9222');
    gulp.watch(frontEndBundle, electron.restart);
    gulp.watch(backEndBundle, electron.restart);
});

