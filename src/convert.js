
const fs = require('fs')

const inFile = process.argv[2]
const outFile = process.argv[3]

const data = fs.readFileSync(inFile, 'utf8').split('\n').slice(2)
        .map((line) => line.split('|').map((entry) => entry.trim()))
        .map(([name, related, data]) => [name, related, data].join('\t'))
        .join('\n')

fs.writeFileSync(outFile, data)