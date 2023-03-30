

//根據組字符，產生字框，part 為第幾個部件。
//sorry AU, 這是很naive 的implementation
const frameForIDC = function(idc, frame, part) {
    if(typeof idc === 'string') idc = idc.codePointAt(0)
    const { p1, p2 } = frame
    const f = {
        p1 : {x: 0, y: 0},
        p2 : {x: 1, y: 1},
    }
    switch (idc) {
        case 0x2ff0: // ⿰
            if (part == 0) {
                f.p1 = p1
                f.p2.x = (p2.x - p1.x) / 2
                f.p2.y = p2.y
            } else {
                f.p1.x = (p2.x - p1.x) / 2.5
                f.p1.y = p1.y
                f.p2 = p2
            }
            break;
        case 0x2ff1: // ⿱
            if (part == 0) {
                f.p1 = p1
                f.p2.x = p2.x
                f.p2.y = (p2.y - p1.y) / 2
            } else {
                f.p1.x = p1.x
                f.p1.y = (p2.y - p1.y) / 2.5
                f.p2 = p2
            }
            break;
        case 0x2ff2: // ⿲
            if (part == 0) {
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
            break;
        case 0x2ff3: // ⿳
            if (part == 0) {
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
            break;
    }
    return f;
}

module.exports = frameForIDC
