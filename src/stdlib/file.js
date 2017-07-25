const RPNProgram = require('../struct/RPNProgram');
const fs = require('fs');

module.exports = p => RPNProgram.makeModule({
    exists: a => {
        if (p.safe) return false;
        return fs.statSync(a).isFile();
    },
    mkdir: a => {
        if (p.safe) return false;
        try {
            fs.mkdirSync(a);
            return true;
        } catch (err) {
            if (/EEXIST/.test(err.message)) return true;
            return false;
        }
    },
    read: a => {
        if (p.safe) return '';
        try {
            return fs.readFileSync(a, 'utf-8');
        } catch (err) {
            return undefined;
        }
    },
    write: (a, b) => {
        if (p.safe) return false;
        try {
            fs.writeFileSync(a, b);
            return true;
        } catch (err) {
            return false;
        }
    }
});
