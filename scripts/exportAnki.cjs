const fs = require('fs');
const path = require('path');

const vocabPath = path.join(__dirname, '..', 'public', 'vocab.json');
const outPath = path.join(__dirname, '..', 'public', 'anki.csv');

const vocab = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
const lines = ['word,definition'];

vocab.forEach(v => {
  const def = String(v.definition || '').replace(/"/g, '""');
  lines.push(`"${v.word}","${def}"`);
});

fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log(`Exported ${vocab.length} entries to ${outPath}`);
