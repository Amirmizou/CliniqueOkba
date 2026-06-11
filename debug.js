const cp = require('child_process');
const next = cp.spawn('node', ['node_modules/next/dist/bin/next', 'build'], { stdio: 'pipe' });

next.stdout.on('data', data => process.stdout.write(data));
next.stderr.on('data', data => process.stderr.write(data));

next.on('close', code => console.log(`Exited with ${code}`));
