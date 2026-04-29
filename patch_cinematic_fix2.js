const fs = require('fs');
let html = fs.readFileSync('grid.html', 'utf8');

// replace toNode.login with toNode.author
html = html.replace(/\$\{toNode\.login\}/g, '${toNode.author || "Unknown"}');

fs.writeFileSync('grid.html', html);
console.log("Fixed undefined author name.");
