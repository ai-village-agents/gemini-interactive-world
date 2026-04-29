const fs = require('fs');
let html = fs.readFileSync('grid.html', 'utf8');

// 1. Add array for ephemeral echos
if (!html.includes('let ephemeralEchos = [];')) {
    html = html.replace('let nodes = [];', 'let nodes = [];\n        let ephemeralEchos = [];');
    html = html.replace('let marks = [];', 'let marks = [];\n        let ephemeralEchos = [];');
}

// 2. Add click listener to canvas to spawn echos with Shift+Click
const spawnEchoFunc = `
        function spawnEphemeralEcho(x, y) {
            ephemeralEchos.push({
                x: x,
                y: y,
                createdAt: performance.now(),
                duration: 60000, // 60 seconds
                hue: Math.random() * 360
            });
            addEventLog(\`Ephemeral Echo created at [\${Math.round(x)}, \${Math.round(y)}]\`);
            
            // Play a soft sound
            playSineWave(200 + Math.random() * 400, 'sine', 0.5, 0.1);
        }
`;
if (!html.includes('function spawnEphemeralEcho(')) {
    html = html.replace('function spawnScanWave(', spawnEchoFunc + '\n        function spawnScanWave(');
}

// 3. Update mousedown listener
const oldMouseDown = `
        canvas.addEventListener('mousedown', (event) => {
            isDragging = true;
`;
const newMouseDown = `
        canvas.addEventListener('mousedown', (event) => {
            if (event.shiftKey) {
                const worldCoords = screenToWorld(event.clientX, event.clientY);
                spawnEphemeralEcho(worldCoords.x, worldCoords.y);
                return; // don't drag if shift clicking
            }
            isDragging = true;
`;
if (html.includes(oldMouseDown)) {
    html = html.replace(oldMouseDown, newMouseDown);
}

// 4. Render ephemeral echos
const renderEchos = `
            // Render Ephemeral Echos
            const now = performance.now();
            for (let i = ephemeralEchos.length - 1; i >= 0; i--) {
                const echo = ephemeralEchos[i];
                const age = now - echo.createdAt;
                if (age > echo.duration) {
                    ephemeralEchos.splice(i, 1);
                    continue;
                }
                
                const s = worldToScreen(echo.x, echo.y);
                const progress = age / echo.duration;
                const alpha = (1 - progress) * 0.8;
                const radius = 2 + Math.sin(age * 0.005) * 1.5; // pulsing
                
                ctx.beginPath();
                ctx.arc(s.x, s.y, radius * camera.zoomLevel, 0, Math.PI * 2);
                ctx.fillStyle = \`hsla(\${echo.hue}, 100%, 70%, \${alpha})\`;
                ctx.fill();
                
                // Outer glow
                ctx.beginPath();
                ctx.arc(s.x, s.y, radius * 3 * camera.zoomLevel, 0, Math.PI * 2);
                ctx.fillStyle = \`hsla(\${echo.hue}, 100%, 70%, \${alpha * 0.2})\`;
                ctx.fill();
            }
`;

if (!html.includes('// Render Ephemeral Echos')) {
    html = html.replace('// Draw marks', renderEchos + '\n            // Draw marks');
}

// 5. Update UI instructions
const oldHints = "Space to Jump • C for Tour Mode.";
const newHints = "Space to Jump • C for Tour Mode • Shift-Click to leave Echo.";
if (html.includes(oldHints)) {
    html = html.replace(oldHints, newHints);
} else if (html.includes("Space to Jump")) {
    html = html.replace(/Space to Jump[^<]*/, newHints);
}


fs.writeFileSync('grid.html', html);
console.log("Ephemeral Echos injected!");
