"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const log_1 = require("../modules/log");
const parseRange_1 = require("../utils/parseRange");
function ResRange(req, res) {
    const { __absolutePath, __stats } = req;
    const { size } = __stats;
    const range = parseRange_1.parseRange(req.headers['range'], size);
    if (range) {
        const { start, end } = range;
        res.setHeader('Content-Range', `bytes ${start}-${end}/${size}`);
        res.setHeader('Content-Length', (end - start + 1));
        const stream = fs_1.createReadStream(__absolutePath, { start, end });
        res.writeHead(206, 'Partial content');
        stream.pipe(res);
        log_1.LOG({ type: 'RES_RANGE', msg: __absolutePath });
    }
    else {
        res.removeHeader('Content-Length');
        res.setHeader('Content-Range', `bytes=*/${size}`);
        res.writeHead(416, 'Out of range');
        res.end();
        log_1.LOG({ type: '416', msg: __absolutePath });
    }
}
exports.ResRange = ResRange;
//# sourceMappingURL=ResRange.js.map