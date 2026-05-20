require('dotenv').config()
const { spawn } = require('child_process')
const path = require('path')

const child = spawn('npx', ['tsx', 'src/index.ts'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
})

child.on('error', (err) => console.error('Failed to start:', err))
