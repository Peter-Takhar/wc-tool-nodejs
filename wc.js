// wc - prints newline, word, byte for each File and a total line if more than one FILE is specified. 
//      with no FILE, or when FILE is -, read standard input
//      always in this word: newline, word, character, byte, maximum line length


//TODO:
// tests, docker, standard input?, flags, error paths
const { argv, stdin: input, stdout: output } = require("node:process");
const fs = require("node:fs");
const readLine = require("node:readline");

let fileName = null;

let newLineFlag = false;
let bytesFlag = false;
let charsFlag = false;
let maxLinesFlag = false;
let wordsFlag = false;

//re-write to process command line statements
argv.forEach((val) => {
    if (!(val.includes("node") || val.includes("wc.js"))) {
        if (val.match(/^-/)) {
            val.substring(1).split('').forEach(str => {
                if (!str.match(/[lcmLw]/)) {
                    throw new Error(`Invalid flag: ${str}`);
                }
                if (str.match("l")) {
                    newLineFlag = true;
                } else if (str.match("c")) {
                    bytesFlag = true;
                } else if (str.match("m")) {
                    charsFlag = true;
                } else if (str.match("L")) {
                    maxLinesFlag = true;
                } else if (str.match("w")) {
                    wordsFlag = true;
                }
            });
        }
        else {
            fileName = val;
        }
    }
    if (fileName == null) fileName = "-";
});

if (fileName == null) {
    throw new Error("No filename provided. File name is the first argument.");
}

if (fileName == '-') {
    //WHY DID PUTTING ALIAS OF INPUT MAKE THIS WORK???????
    const rl = readLine.createInterface({ input, output });
    let linesCount = 0;
    let wordsCount = 0;
    let byteCount = 0;
    let maximumLineLength = 0;
    let characterCount = 0;
    rl.on('line', (input) => {
        linesCount++;
        maximumLineLength = input.length > maximumLineLength ? input.length : maximumLineLength;
        wordsCount += input.split(/[\s+]/).filter(str => str.length > 0).length;
        characterCount += input.length;
        byteCount += new Blob([input]).size + 1;
        //does not count words or bytes on last line without newline
    });

    //there is no EOF signal, using SIGINT instead to handle end of input
    //trying to build output in previous
    //EOF is different from how stdin is handled
    rl.on('SIGINT', () => {
        let lastLine = rl.line;
        console.log(lastLine.split(/[\S+]/));
        wordsCount += lastLine.split(/[\s+]/).filter(str => str.length > 0).length;
        byteCount += new Blob([lastLine]).size;
        characterCount += lastLine.length;

        let output = '';
        if (!newLineFlag && !wordsFlag && !charsFlag && !bytesFlag && !maxLinesFlag) output += `${linesCount} ${wordsCount} ${byteCount} `;
        if (newLineFlag) output += linesCount + " ";
        if (wordsFlag) output += wordsCount + " ";
        if (charsFlag) output += characterCount + " ";
        if (bytesFlag) output += byteCount + " ";
        if (maxLinesFlag) output += maximumLineLength + " ";

        console.log(`${output}`);
        rl.close();
    })

} else {
    fs.readFile(fileName, 'utf8', (err, data) => {
        if (err) throw err;

        const blob = new Blob([data]);

        let lines = data.split(/\r\n/g);
        let maximumLineLength = lines.reduce((acc, curr) => curr.length > acc ? curr.length : acc, 0);

        //tabs and empty space can seperate sequence of nonwhite space characters
        let words = lines.filter(line => line.match(/\S+/g)).flatMap(str => str.split(" ")).flatMap(str => str.split(/\t/)).filter(word => word.match(/\S+/g));

        let charCount = data.split("").reduce((acc, curr) => acc + curr.length, 0);
        //POSIX def of a line is a sequence of characters that end in a new line
        //edge case, it is unnecessary to add an extra byte to the last line for newline but its an oddity

        let output = '';
        if (!newLineFlag && !wordsFlag && !charsFlag && !bytesFlag && !maxLinesFlag) output += `${lines.length - 1} ${words.length} ${blob.size} `
        if (newLineFlag) output += lines.length - 1 + " ";
        if (wordsFlag) output += words.length + " ";
        if (charsFlag) output += charCount + " ";
        if (bytesFlag) output += blob.size + " ";
        if (maxLinesFlag) output += maximumLineLength + " ";
        console.log(`${output}${fileName}`);
    });

}




