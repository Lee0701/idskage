
const { Polygons } = require('@kurgm/kage-engine')
const { getOperandByIDC, frameForIDC, suffixForIDC } = require('./idc')

const autofit = (kage) => {

    // Convert unicode string to its name as being used in GlyphWiki
    const convertKey = (ch) => {
        return 'u' + ch.codePointAt(0).toString(16).padStart(4, '0');
    }

    const getKey = (ch, idc, index) => {
        const name = convertKey(ch)
        const suffix = suffixForIDC(idc, index)
        const suffixExists = kage.kBuhin.hash[name + suffix] !== undefined
        if(suffixExists) return name + suffix
        else return name
    }

    const getBoundingBox = (name, size) => {
        const polygons = new Polygons()
        kage.makeGlyph(polygons, name)
        const points = polygons.array.flatMap((polygon) => {
            return polygon.array.map((point) => {
                const { x, y } = point
                return { x, y }
            })
        })
        const { w, h } = size
        const minX = Math.min(...points.map((p) => p.x)) / w
        const minY = Math.min(...points.map((p) => p.y)) / h
        const maxX = Math.max(...points.map((p) => p.x)) / w
        const maxY = Math.max(...points.map((p) => p.y)) / h
        return { minX, minY, maxX, maxY }
    }

    //可遞迴的算框
    const fitparts = (parent, frame) => {
        const idc = parent["ch"].codePointAt(0);
        const operands = getOperandByIDC(idc);
        new Array(operands).fill().map((_, i) => {
            const f = frameForIDC(idc, frame, i);
            const child = parent['p' + i];  //中間代號
            const op = getOperandByIDC(child["ch"].codePointAt(0));
            if (op > 0) fitparts(child, f);//又踫到 IDC，遞迴
            else child.frame = f;
        })
    }

    const fixPartFrames = (tree, pos, size, i=0) => {
        const idc = tree.ch.codePointAt(0)
        const operands = getOperandByIDC(idc)
        if(operands > 0) {
            return new Array(operands).fill().flatMap((_, i) => {
                const child = tree['p' + i]
                return fixPartFrames(child, pos, size, i)
            })
        } else {
            const name = getKey(tree.ch, idc, i)
            const { minX, minY, maxX, maxY } = getBoundingBox(name, size)
            const frame = tree.frame

            // Offset
            const lo = -minX
            const ro = 1 - maxX
            const to = -minY
            const bo = 1 - maxY

            // Margin
            const margin = 0.025
            const lm = margin
            const rm = margin
            const tm = margin
            const bm = margin

            const x1 = (frame.p1.x + lo) + lm
            const y1 = (frame.p1.y + to) + tm
            const x2 = (frame.p2.x + ro) - rm
            const y2 = (frame.p2.y + bo) - bm

            const xr = x2 - x1
            const yr = y2 - y1
            const x = x1 * size.w
            const y = y1 * size.h
            const w = xr * size.w
            const h = yr * size.h

            return [{ name, x, y, w, h }]
        }
    }
    return fixPartFrames
}

module.exports = autofit
