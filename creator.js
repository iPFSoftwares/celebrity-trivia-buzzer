const fs = require("fs");

const wordList = fs.readFileSync("words.txt", 'utf8');
let wordArray = wordList.split('\n').sort(() => Math.random() - 0.5);
let words = [], size = 5;

// while (wordArray.length > 0)
//     words.push(wordArray.splice(0, size));

words = wordArray.map(w => {
    const [ word, hint ] = w.split(" - ");
    return { word, hint }
})

fs.writeFileSync("words.js", `module.exports = ${JSON.stringify(words)}`);