const { task, series } = require('gulp');
const { exec } = require("child_process");


task('build', series('backend', 'frontend'));

task('build-debug', series('backend', 'frontend-debug'));

function packElectron(cb) {
    exec(
        "electron-packager dist app --out=bundle --platform=win32 --arch=x64 --app-version=1.0.0 --overwrite --version-string.CompanyName=Acme --version-string.ProductName=App --version-string.InternalName=AngularSample",
        (err, stdout, stderr) => {
          console.log(stdout);
          cb(err);
        }
      );
}

task("bundle", series('build', packElectron ));
  
  