const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('c:/Users/prath/Desktop/electricity-ms/frontend/src/app');

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  let orig = c;
  
  // Replace card max-widths
  c = c.replace(/ overflow-hidden" style="max-width: (400|500|600|640)px;"/g, ' overflow-hidden w-full max-w-5xl"');
  c = c.replace(/ overflow-hidden mb-6" style="max-width: (400|500|600|640)px;"/g, ' overflow-hidden mb-6 w-full max-w-5xl"');
  
  // There is one in pay-bill: style="max-width: 400px;" on a different div:
  c = c.replace(/ mx-auto mt-6" style="max-width: 400px;"/g, ' mx-auto mt-6 w-full max-w-5xl"');

  if (c !== orig) {
    fs.writeFileSync(f, c);
    console.log('Updated ' + f);
  }
});
