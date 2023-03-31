
//返回組字符所需的部件
const getOperandByIDC = function(idc) {
    if(typeof idc === 'string') idc = idc.codePointAt(0)
    if(idc == 0x2ff2 || idc == 0x2ff3) return 3  //三元組字符
    else if(idc >= 0x2ff0 && idc <= 0x2fff) return 2 //二元組字符
    else return 0
}

const suffixForIDC = function(idc, part) {
    if(typeof idc === 'string') idc = idc.codePointAt(0)
    if(idc == 0x2ff0) {
        return (part == 0) ? '-01' : '-02'
    } else if(idc <= 0x2ff1) {
        return (part == 0)? '-03' : '-04'
    } else if(idc == 0x2ff2) {
        return (part < 2) ? '-01' : '-02'
    } else if(idc == 0x2ff3) {
        return (part < 2)? '-03' : '-04'
    } else if(idc >= 0x2ff4 && idc <= 0x2ffa) {
        return (part == 0) ? '-05' : '-06'
    }
    return ''
}

//根據組字符，產生字框，part 為第幾個部件。
//sorry AU, 這是很naive 的implementation
const frameForIDC = function(idc, frame, part) {
    if(typeof idc === 'string') idc = idc.codePointAt(0)
    const { p1, p2 } = frame
    const f = {
        p1: { x: 0, y: 0 },
        p2: { x: 1, y: 1 },
    }
    switch (idc) {
        case 0x2ff0: // ⿰
            if(part == 0) {
                f.p1 = p1
                f.p2.x = (p2.x - p1.x) / 2
                f.p2.y = p2.y
            } else {
                f.p1.x = (p2.x - p1.x) / 2
                f.p1.y = p1.y
                f.p2 = p2
            }
            break

        case 0x2ff1: // ⿱
            if(part == 0) {
                f.p1 = p1
                f.p2.x = p2.x
                f.p2.y = (p2.y - p1.y) / 2
            } else {
                f.p1.x = p1.x
                f.p1.y = (p2.y - p1.y) / 2
                f.p2 = p2
            }
            break

        case 0x2ff2: // ⿲
            if(part == 0) {
                f.p1 = p1
                f.p2.x = (p2.x - p1.x) / 3
                f.p2.y = p2.y
            } else if(part == 1) {
                f.p1.x = (p2.x - p1.x) / 3
                f.p1.y = p1.y
                f.p2.x = (p2.x - p1.x) / 3 * 2
                f.p2.y = p2.y
            } else {
                f.p1.x = (p2.x - p1.x) / 3 * 2
                f.p1.y = p1.y
                f.p2 = p2
            }
            break

        case 0x2ff3: // ⿳
            if(part == 0) {
                f.p1 = p1
                f.p2.x = p2.x
                f.p2.y = (p2.y - p1.y) / 3
            } else if(part == 1) {
                f.p1.x = p1.x
                f.p1.y = (p2.y - p1.y) / 3
                f.p2.x = p2.x
                f.p2.y = (p2.y - p1.y) / 3 * 2
            } else {
                f.p1.x = p1.x
                f.p1.y = (p2.y - p1.y) / 3 * 2
                f.p2 = p2
            }
            break

        case 0x2ff4: // ⿴
            if(part == 0) {
                f.p1 = p1
                f.p2 = p2
            } else {
                const gapX = 0.1
                const gapY = 0.0625
                f.p1.x = p1.x + gapX
                f.p1.y = p1.y + gapY
                f.p2.x = p2.x - gapX
                f.p2.y = p2.y - gapY
            }
            break

        case 0x2ff5: // ⿵
        if(part == 0) {
            f.p1 = p1
            f.p2 = p2
        } else {
            const gapX = 0.1
            const gapY = 0.0625
            f.p1.x = p1.x + gapX
            f.p1.y = p1.y + gapY
            f.p2.x = p2.x - gapX
            f.p2.y = p2.y
        }
        break

        case 0x2ff6: // ⿶
            if(part == 0) {
                f.p1 = p1
                f.p2 = p2
            } else {
                const gapX = 0.1
                const gapY = 0.0625
                f.p1.x = p1.x + gapX
                f.p1.y = p1.y
                f.p2.x = p2.x - gapX
                f.p2.y = p2.y - gapY
            }
            break

        case 0x2ff7: // ⿷
        if(part == 0) {
            f.p1 = p1
            f.p2 = p2
        } else {
            const gapX = 0.1
            const gapY = 0.0625
            f.p1.x = p1.x + gapX
            f.p1.y = p1.y + gapY
            f.p2.x = p2.x
            f.p2.y = p2.y - gapY
        }
        break

        case 0x2ff8: // ⿸
        if(part == 0) {
            f.p1 = p1
            f.p2 = p2
        } else {
            const gapX = 0.1
            const gapY = 0.0625
            f.p1.x = p1.x + gapX
            f.p1.y = p1.y + gapY
            f.p2.x = p2.x
            f.p2.y = p2.y
        }
        break

        case 0x2ff9: // ⿹
        if(part == 0) {
            f.p1 = p1
            f.p2 = p2
        } else {
            const gapX = 0.1
            const gapY = 0.0625
            f.p1.x = p1.x
            f.p1.y = p1.y + gapY
            f.p2.x = p2.x - gapX
            f.p2.y = p2.y
        }
        break

        case 0x2ffa: // ⿺
        if(part == 0) {
            f.p1 = p1
            f.p2 = p2
        } else {
            const gapX = 0.1
            const gapY = 0.0625
            f.p1.x = p1.x + gapX
            f.p1.y = p1.y
            f.p2.x = p2.x
            f.p2.y = p2.y - gapY
        }
        break

        case 0x2ff7b: // ⿻
        if(part == 0) {
            f.p1 = p1
            f.p2 = p2
        } else {
            f.p1 = p1
            f.p2 = p2
        }
        break
    }
    return f
}

module.exports = {
    getOperandByIDC,
    frameForIDC,
    suffixForIDC,
}
