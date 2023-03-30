
const { getOperandByIDC, frameForIDC, suffixForIDC } = require('./idc')

const autofit = (kage) => {

    // Convert unicode string to its name as being used in GlyphWiki
    const convertKey = (ch) => {
        return 'u' + ch.codePointAt(0).toString(16).padStart(4, '0');
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

    const fixPartFrames = (tree, pos, size) => {
        const idc = tree.ch.codePointAt(0)
        const operands = getOperandByIDC(idc)
        return new Array(operands).fill().flatMap((_ ,i) => {
            const child = tree['p' + i]
            const op = getOperandByIDC(child.ch.codePointAt(0))
            if (op > 0) {
                return fixPartFrames(child, pos, size)
            } else {
                const frame = child.frame
                const x = frame.p1.x * size.w
                const y = frame.p1.y * size.h
                const xr = frame.p2.x - frame.p1.x
                const yr = frame.p2.y - frame.p1.y
                const w = size.w * xr
                const h = size.h * yr
                const name = convertKey(child.ch) + suffixForIDC(idc, i)
                return [{ name, x, y, w, h }]
            }
        })
    }
    return fixPartFrames
}

module.exports = autofit
