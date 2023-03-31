
const fs = require('fs')
const { Kage, Polygons } = require('@kurgm/kage-engine')
const { createCanvas } = require('canvas')
const compose = require('./compose')
const autofit = require('./autofit')

const loadTsv = (file) => {
    const glypheme = Object.fromEntries(fs.readFileSync(file, 'utf8').split('\n')
            .map((line) => line.split('\t'))
            .map(([name, related, data]) => [name, data]))
    const decompose = {}
    return { glypheme, decompose }
}
const loadMock = () => {
    return require('./mockdata')
}

const drawPNG = (outFile, polygons) => {
    const size = 512
    const canvas = createCanvas(size, size)
    const ctx = canvas.getContext('2d')

    //clear canvas
    ctx.fillStyle = "rgb(255, 255, 255)"
    ctx.fillRect(0, 0, size, size)

    //kage 的精度為 200x200 ，轉換為 target canvas size
    rx = size / 200
    ry = size / 200

    ctx.fillStyle = "rgb(0, 0, 0)"
    //繪製canvas, 這裡可改為輸出 svg
    for(var i = 0; i < polygons.array.length; i++) {
        ctx.beginPath()
        ctx.moveTo(rx * polygons.array[i].array[0].x, ry * polygons.array[i].array[0].y)
        for(var j = 1; j < polygons.array[i].array.length; j++) {
            ctx.lineTo(rx * polygons.array[i].array[j].x, ry * polygons.array[i].array[j].y)
        }
        ctx.closePath()
        ctx.fill()
    }
    fs.writeFileSync(outFile, canvas.toBuffer('image/png'))
}

const drawSVG = (outFile, polygons) => {
    fs.writeFileSync(outFile, polygons.generateSVG())
}

const main = () => {
    const ids = process.argv[2]
    const outFile = process.argv[3] || 'out.svg'
    const dict = parseInt(process.argv[4] || '0')

    const kage = new Kage()
    const { glypheme, decompose } = (dict == 0) ? loadTsv('res/buhin.tsv') : loadMock()
    Object.entries(glypheme).forEach(([name, data]) => kage.kBuhin.push(name, data))
    const buildTree = compose(glypheme, decompose)
    const fixPartFrames = autofit(kage)

    const drawdgg = function(ids) {
        const idsTree = buildTree(ids) // a tree to hold IDS sequence
        const pos = { x: 0, y: 0 }
        const size = { w: 200, h: 200 } // glyphwiki max frame size
        const output = fixPartFrames(idsTree, pos, size)
        return output
    }

    const partframes = drawdgg(ids)
    const idsframe = partframes.map((P) => {
        return `99:0:0:${P.x}:${P.y}:${P.w+P.x}:${P.h+P.y}:${P.name}`
    }).join('$')

    const polygons = new Polygons()
    kage.kBuhin.push("ids", idsframe)
    kage.makeGlyph(polygons, "ids")

    if(outFile.endsWith('.svg')) drawSVG(outFile, polygons)
    else drawPNG(outFile, polygons)

}
main()
