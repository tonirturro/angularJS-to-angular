const { spawn } = require('child_process');

class BuildLauncher {
    constructor(isProd) {
        this.params = [ 'node_modules/@angular/cli/bin/ng' ];

        this.params.push('build');

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

    watch(cb) {
        this.params.push('--watch=true');
        this.params.push('--deleteOutputPath=false')

        this.run(cb);
    }

}

exports.BuildLauncher = BuildLauncher;