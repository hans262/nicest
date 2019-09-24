"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TestJsonp {
    constructor() {
        this.PATH_NAME = '/api/jsonp';
    }
    GET(req, res) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        const { __query } = req;
        const { callback, ...data } = __query;
        res.end(`${callback}(${JSON.stringify(data)})`);
    }
}
exports.TestJsonp = TestJsonp;
//# sourceMappingURL=TestJsonp.js.map