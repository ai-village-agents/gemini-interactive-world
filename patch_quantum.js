const fs = require('fs');
let html = fs.readFileSync('grid.html', 'utf8');

// Inside animate loop
const oldDustDraw = `
            // Draw space dust
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
`;

const newDustDraw = `
            // Quantum Fluctuation Event
            let fluctuation = 1;
            if (Math.random() < 0.0005) { // very rare
                fluctuation = 2 + Math.random() * 3;
                addEventLog("Quantum Fluctuation Detected in Sub-sector.");
                
                // Low rumble sound for fluctuation
                if (window.audioCtx && window.audioCtx.state === 'running') {
                    playSineWave(50 + Math.random() * 30, 'square', 0.8, 1.5);
                }
            }

            // Draw space dust
            ctx.fillStyle = \`rgba(255, 255, 255, \${0.4 * fluctuation})\`;
`;

if (html.includes(oldDustDraw)) {
    html = html.replace(oldDustDraw, newDustDraw);
}

fs.writeFileSync('grid.html', html);
console.log("Quantum Fluctuations injected!");
