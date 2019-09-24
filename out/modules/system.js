"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
function shell() {
    child_process_1.exec('node -v', (err, stdout, stderr) => {
        if (err)
            return console.log(err);
        console.log(stdout);
        console.log(stderr);
    });
    const stdout = child_process_1.execSync('node -v');
    console.log(stdout.toString());
}
exports.shell = shell;
//# sourceMappingURL=system.js.map