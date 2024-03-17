const fs = require('fs')
const path = require("path");
// Usage: node replaceInFile.js <file> <search> <replace>
// Set this to false when running from a script
const DEBUG = true;


function log(...args) {
    if (DEBUG) {
        console.log(...args);
    }
}

log('Dir Replacer...')
if(process.argv.length < 4) {
    log('Usage: node replaceInFile.js <file> <search> <replace>')
    process.exit(1)
}

function replaceInFile(file, from, to) {
    fs.readFile(file, 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        const fromRE = new RegExp(from, 'g');
        const result = data.replace(fromRE, to);
        if(data !== result){
            fs.writeFile(file, result, 'utf8', function (err) {
                if (err) return console.log(err);

                log('Done! Replaced all occurrences of', from, 'with', to, 'in', file, '!');
            });
        }
    });
}

function replaceInDir(dir, from, to) {
    fs.readdir(dir,{withFileTypes: true}, (err, files) => {
        if (err) {
            return console.log(err);
        }
        files.forEach(file => {
            const filePath = path.join(file.path, file.name);
            if(file.isDirectory()){
                replaceInDir(filePath,from,to);
            }
            else{
                replaceInFile(filePath,from,to);
            }
        });
    });
}


const dir = process.argv[2]
log('Dir:', dir)
const from = process.argv[3]
log('From:', from)
const to = process.argv[4]
log('To:', to)
replaceInDir(dir, from, to)
