/*
A very naive implementation , calculate part frame from IDS 

yapcheahshen@gmail.com at MOEDICT 萌典松 2015/3/28

*/

const { fixedCharAt } = require('./utf16')
const { getOperandByIDC, frameForIDC } = require('./idc')

const compose = (kage) => {

    //全字框, 以小數表示。
    const fullFrame = function() {
        return {
            p1 : {x: 0, y: 0},
            p2 : {x: 1, y: 1},
        }
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
                    const f = frameForIDC(ch, frame, i)
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

    return buildTree
}

module.exports = compose
