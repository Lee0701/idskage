
const fs = require('fs')
const { Kage, Polygons } = require('@kurgm/kage-engine')
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

const main = () => {
    const ids = process.argv[2]

    const kage = new Kage()
    const { glypheme, decompose } = loadTsv('res/buhin.tsv')
    Object.entries(glypheme).forEach(([name, data]) => kage.kBuhin.push(name, data))
    const drawdgg = autofit(glypheme, decompose)

    const partframes = drawdgg(ids)
    const idsframe = partframes.map((P) => {
        return `99:0:0:${P.x}:${P.y}:${P.w+P.x}:${P.h+P.y}:${P.part}`
    }).join('$')

    const polygons = new Polygons()
    kage.kBuhin.push("ids", idsframe);
    kage.makeGlyph(polygons, "ids");
    console.log(polygons.generateSVG())

}
main()
