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
    let maximumLineLength = lines.reduce((acc, curr) => curr.length > acc ? curr.length : acc, 0);
    
    //tabs and empty space can seperate sequence of nonwhite space characters
    let words = lines.filter(line => line.match(/\S+/g)).flatMap(str => str.split(" ")).flatMap(str => str.split(/\t/)).filter(word => word.match(/\S+/g));
     
    let charCount = data.split("").reduce((acc, curr) => acc + curr.length, 0);
    //POSIX def of a line is a sequence of characters that end in a new line
    //edge case, it is unnecessary to add an extra byte to the last line for newline but its an oddity
    console.log(`${lines.length-1} ${words.length} ${charCount} ${blob.size} ${maximumLineLength} ${fileName}`);
});



