/*
A very naive implementation , calculate part frame from IDS 

yapcheahshen@gmail.com at MOEDICT 萌典松 2015/3/28

*/

const { fixedCharAt } = require('./utf16')
const frameByIDC = require('./idc')

const compose = (glypheme, decompose) => {

    // Convert unicode string to its name as being used in GlyphWiki
    const convertKey = function(ch) {
        return 'u' + ch.codePointAt(0).toString(16).padStart(4, '0');
    }

    //返回組字符所需的部件
    const getOperandByIDC = function(code) {
        if(typeof code === 'string') code = code.codePointAt(0)
        if (code == 0x2ff2 || code == 0x2ff3) return 3;  //三元組字符
        else if (code >= 0x2ff0 && code <= 0x2fff) return 2; //二元組字符
        else return 0;
    }

    //全字框, 以小數表示。
    const fullFrame = function() {
        return {
            p1 : {x: 0, y: 0},
            p2 : {x: 1, y: 1},
        }
    };

    //可遞迴的算框
    const fitparts = function(parent, frame) {
        const idc = parent["ch"].codePointAt(0);
        const operands = getOperandByIDC(idc);
        new Array(operands).fill().map((_, i) => {
            const f = frameByIDC(idc, frame, i);
            const child = parent['p' + i];  //中間代號
            const op = getOperandByIDC(child["ch"].codePointAt(0));
            if (op > 0) fitparts(child, f);//又踫到 IDC，遞迴
            else child.frame = f;
        })
    }

    const buildTree = (ids) => {
        const recursive = (ids, frame) => {
            const ch = fixedCharAt(ids, 0)
            const operands = getOperandByIDC(ch)
            if(operands == 0) {
                return [{ ch, frame }, ch.length]
            } else {
                let index = 1
                const children = new Array(operands).fill().map((_, i) => {
                    const f = frameByIDC(ch, frame, i)
                    const [childTree, j] = recursive(ids.slice(index), f)
                    index += j
                    return ['p' + i, childTree]
                })
                const childrenTree = Object.fromEntries(children)
                return [{ ch, ...childrenTree }, index]
            }
        }
        return recursive(ids, fullFrame())[0]
    }

    const drawParts = (tree, pos, size) => {
        const idc = tree.ch.codePointAt(0)
        const operands = getOperandByIDC(idc)
        return new Array(operands).fill().flatMap((_ ,i) => {
            const child = tree['p' + i]
            const op = getOperandByIDC(child.ch.codePointAt(0))
            if (op > 0) {
                return drawParts(child, pos, size)
            } else {
                const frame = child.frame
                const x = frame.p1.x * size.w
                const y = frame.p1.y * size.h
                const xr = frame.p2.x - frame.p1.x
                const yr = frame.p2.y - frame.p1.y
                const w = size.w * xr
                const h = size.h * yr
                return [{ name: convertKey(child.ch), x, y, w, h }]
            }
        })
    }

    const drawdgg = function(ids) {
        const idsTree = buildTree(ids) // a tree to hold IDS sequence
        const pos = { x: 0, y: 0 }
        const size = { w: 200, h: 200 }
        const output = drawParts(idsTree, pos, size) // glyphwiki max frame size
        return output
    }

    return drawdgg
}

module.exports = compose
