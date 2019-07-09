const { spawn } = require('child_process');

class BuildLauncher {
    constructor(isBackend, isProd) {
        this.params = [ 'node_modules/@angular/cli/bin/ng' ];

        if (isBackend) {
            this.params.push('run');
            this.params.push('backend:build');
        } else {
            this.params.push('build');
        }

        if (isProd) {
            this.params.push('--prod=true');
        }
    }

    run(cb) {
        const buildSpawn = spawn('node', this.params, { stdio: ['inherit', 'inherit', 'inherit'] });

        buildSpawn.on("close", (code) => {
            cb(code);
        });
    }
}

exports.BuildLauncher = BuildLauncher;