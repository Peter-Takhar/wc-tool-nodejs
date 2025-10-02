// wc - prints newline, word, byte for each File and a total line if more than one FILE is specified. 
//      with no FILE, or when FILE is -, read standard input
//      always in this word: newline, word, character, byte, maximum line length


const { argv } = require("node:process");
const fs = require("node:fs");

let fileName = null;


//re-write to process command line statements
argv.forEach((val, index) => {
    if (index == 2) fileName = val;
});

if (fileName == null) {
    throw new Error("No filename provided. File name is the first argument.");
}

console.log(`You have inputted this file name: ${fileName}`);


fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) throw err;
    
    const blob = new Blob([data]);

    let lines = data.split(/\r\n/g);
    // let maximumLineLength = 0;
    // lines.forEach(str => { if (str.length > maximumLineLength) { maximumLineLength = str.length } });
    let maximumLineLength = lines.reduce((acc, curr) => curr.length > acc ? curr.length : acc, 0);
    let words = lines.filter(line => line.length > 0).flatMap(str => str.split(" ")).filter(word => word.length > 0);
    console.log(words);
     
    let charCount = data.split("").reduce((acc, curr) => acc + curr.length, 0);
    
    console.log(`${lines.length} ${words.length} ${charCount} ${blob.size} ${maximumLineLength} ${fileName}`);
});

