const { spawn } = require('child_process');
const path = require('path');

console.log('=== STARTING HERO CYCLES PRICING SYSTEM ===');

const backendDir = path.join(__dirname, 'backend');
const frontendDir = path.join(__dirname, 'frontend');

// Helper to log output with prefixes
function logOutput(prefix, stream) {
  stream.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line) console.log(`[${prefix}] ${line}`);
    });
  });
}

// Start Backend (Port 5000)
console.log('Starting Backend Server (port 5000)...');
const backend = spawn('npm', ['start'], { cwd: backendDir, shell: true });
logOutput('Backend', backend.stdout);
logOutput('Backend (Error)', backend.stderr);

// Start Frontend (Vite)
console.log('Starting Frontend Server...');
const frontend = spawn('npm', ['run', 'dev'], { cwd: frontendDir, shell: true });
logOutput('Frontend', frontend.stdout);
logOutput('Frontend (Error)', frontend.stderr);

// Handle termination
process.on('SIGINT', () => {
  console.log('\nStopping servers...');
  backend.kill();
  frontend.kill();
  process.exit();
});
