const fs = require('fs')
const path = require('path')

const BUILD_DIR = path.resolve(__dirname, '../build')

if (fs.existsSync(BUILD_DIR)) {
    fs.rmdirSync(BUILD_DIR, { recursive: true })
}

console.log(`removed ${BUILD_DIR}`)
