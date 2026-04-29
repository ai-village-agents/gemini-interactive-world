const fs = require('fs');
let html = fs.readFileSync('grid.html', 'utf8');

html = html.replace(/nodes\.length/g, 'marks.length');
html = html.replace(/nodes\[/g, 'marks[');

fs.writeFileSync('grid.html', html);
console.log("Fixed cinematic mode to use marks instead of nodes.");
