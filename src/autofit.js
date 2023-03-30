/*
A very naive implementation , calculate part frame from IDS 

yapcheahshen@gmail.com at MOEDICT 萌典松 2015/3/28

*/

module.exports = (glypheme, decompose) => {

    // Convert unicode string to its name as being used in GlyphWiki
    const convertKey = function(ch) {
        return 'u' + ch.charCodeAt(0).toString(16).padStart(4, '0');
    }

    //返回組字符所需的部件
    const getOperandByIDC = function(c) {
        if (c == 0x2ff2 || c == 0x2ff3) return 3;  //三元組字符
        else if (c >= 0x2ff0 && c <= 0x2fff) return 2; //二元組字符
        else return 0;
    }

    //全字框, 以小數表示。
    const fullframe = function() {
        return {
            p1 : {x: 0, y: 0},
            p2 : {x: 1, y: 1},
        }
    };

    //根據組字符，產生字框，part 為第幾個部件。
    //sorry AU, 這是很naive 的implementation
    const framebypart = function(idc, frame, part) {
        const { p1, p2 } = frame
        const f = {
            p1 : {x: 0, y: 0},
            p2 : {x: 1, y: 1},
        }
        switch (idc) {
            case 0x2ff0: // ⿰
                if (0 == part) {
                    f.p1.x = p1.x; f.p1.y = p1.y;
                    f.p2.x = (p2.x - p1.x) / 2; f.p2.y = p2.y;
                } else {
                    f.p1.x = (p2.x - p1.x) / 2.5; f.p1.y = p1.y;
                    f.p2.x = p2.x; f.p2.y = p2.y;
                }
                break;
            case 0x2ff1: // ⿱
                if (0 == part) {
                    f.p1.x = p1.x; f.p1.y = p1.y;
                    f.p2.x = p2.x; f.p2.y = (p2.y - p1.y) / 2;
                } else {
                    f.p1.x = p1.x; f.p1.y = (p2.y - p1.y) / 2.5;
                    f.p2.x = p2.x; f.p2.y = p2.y;
                }
                break;
        }
        return f;
    }

    //可遞迴的算框
    const fitparts = function(parent, frame) {
        const idc = parent["ch"].charCodeAt(0);
        let operand = getOperandByIDC(idc);
        let i = 1;
        while (operand > 0) {
            const f = framebypart(idc, frame, i - 1);
            const child = parent["p" + i];  //中間代號
            op = isIDC(child["ch"].charCodeAt(0));
            if (op > 0) fitparts(child, f);//又踫到 IDC，遞迴
            else child.frame = f;
            i++; operand--;
        }
    }
    const idstree = {};//a tree to hold IDS

    const addchild = function(ids, parent, frame) {
        const idc = ids.charCodeAt(0);
        let operand = getOperandByIDC(idc);

        if (!operand) {
            const childids = decompose[ids[0]];
            if (childids) {
                return addchild(childids, parent, frame);
            }
        }
        parent.ch = ids[0];
        ids = ids.substring(1, ids.length);
        let i = 1;
        while (operand > 0) {
            op = getOperandByIDC(ids.charCodeAt(0));
            const f = framebypart(idc, frame, i - 1);
            // 產生一個中間代號
            const child = parent["p" + i] = { "ch": ids[0] };
            if (op > 0) {//IDC
                ids = addchild(ids, child, f);
                fitparts(child, f);
            } else { //normal characters
                if (glypheme[convertKey(ids[0])]) { //it is a part
                    //這裡有點問題
                } else { //try IDS
                    childids = decompose[convertKey(ids[0])]; //看看這個部件是否有 IDS
                    ids = addchild(childids, child, f); //遞迴組字
                }

                ids = ids.substring(1, ids.length); // consume first char
                child.frame = f;
            }
            i++; operand--;
        }
        return ids;
    }

    const drawparts = function(output, parent, x, y, w, h) {
        const idc = parent.ch.charCodeAt(0);
        let operand = getOperandByIDC(idc);
        let i = 1;
        while (operand > 0) {
            const child = parent["p" + i];
            op = getOperandByIDC(child.ch.charCodeAt(0));
            if (op > 0) drawparts(output, child, x, y, w, h);
            else {
                const f = child.frame;
                const xr = f.p2.x - f.p1.x;
                const yr = f.p2.y - f.p1.y;
                //console.log(f)
                output.push({ part: convertKey(child.ch), x: f.p1.x * w, y: f.p1.y * h, w: w * xr, h: h * yr });
            }
            i++; operand--;
        }
    }

    const drawdgg = function(ids) {
        addchild(ids, idstree, fullframe());
        const output = [];
        drawparts(output, idstree, 0, 0, 200, 200); //glyphwiki max frame
        return output;
    }

    return drawdgg
}
