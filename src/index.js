
const fs = require('fs')
const { Kage, Polygons } = require('@kurgm/kage-engine')
const compose = require('./compose')

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

const main = () => {
    const ids = process.argv[2]
    const dict = parseInt(process.argv[3] || '0')

    const kage = new Kage()
    const { glypheme, decompose } = (dict == 0) ? loadTsv('res/buhin.tsv') : loadMock()
    Object.entries(glypheme).forEach(([name, data]) => kage.kBuhin.push(name, data))
    const drawdgg = compose(glypheme, decompose)

    const partframes = drawdgg(ids)
    const idsframe = partframes.map((P) => {
        return `99:0:0:${P.x}:${P.y}:${P.w+P.x}:${P.h+P.y}:${P.name}`
    }).join('$')

    const polygons = new Polygons()
    kage.kBuhin.push("ids", idsframe);
    kage.makeGlyph(polygons, "ids");
    console.log(polygons.generateSVG())

}
main()
