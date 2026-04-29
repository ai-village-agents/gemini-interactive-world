// Script to inject Cinematic Tour Mode
const fs = require('fs');
let html = fs.readFileSync('grid.html', 'utf8');

// 1. Add variable for cinematic mode
if (!html.includes('let cinematicMode = false;')) {
    html = html.replace('let cameraPanAnimation = null;', 'let cameraPanAnimation = null;\n        let cinematicMode = false;\n        let cinematicTimeout = null;');
}

// 2. Add cinematic pan function
const cinematicPanFunc = `
        function startCinematicPan() {
            if (!cinematicMode || nodes.length === 0) return;
            
            // Pick a random destination
            const toNode = nodes[Math.floor(Math.random() * nodes.length)];
            
            const fromX = camera.offsetX;
            const fromY = camera.offsetY;
            
            // Calculate distance
            const dx = toNode.x - fromX;
            const dy = toNode.y - fromY;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            // Dynamic duration based on distance, min 5 seconds, max 20 seconds
            let duration = (dist / 200) * 1000; 
            if (duration < 5000) duration = 5000;
            if (duration > 20000) duration = 20000;

            cameraPanAnimation = {
                startTime: performance.now(),
                duration: duration,
                fromX: fromX,
                fromY: fromY,
                toX: toNode.x,
                toY: toNode.y
            };
            
            addEventLog(\`Cinematic Tour en route to \${toNode.login}\`);
        }
`;
if (!html.includes('function startCinematicPan()')) {
    html = html.replace('function startCameraPan(fromNode, toNode) {', cinematicPanFunc + '\n        function startCameraPan(fromNode, toNode) {');
}

// 3. Modify updateCameraPanAnimation to trigger next pan in cinematic mode
const oldUpdatePan = `
            if (progress >= 1) {
                cameraPanAnimation = null;
            }
`;
const newUpdatePan = `
            if (progress >= 1) {
                cameraPanAnimation = null;
                if (cinematicMode) {
                    cinematicTimeout = setTimeout(startCinematicPan, 3000); // Wait 3 seconds at destination
                }
            }
`;
if (html.includes(oldUpdatePan)) {
    html = html.replace(oldUpdatePan, newUpdatePan);
} else if (html.includes('cameraPanAnimation = null;') && html.includes('if (progress >= 1)')) {
    // maybe already applied?
} else {
    console.log("Could not find progress >= 1 block");
}

// 4. Key listener for 'C' to toggle cinematic mode
const keyListener = `
        window.addEventListener('keydown', (event) => {
            if (event.code === 'KeyC') {
                cinematicMode = !cinematicMode;
                if (cinematicMode) {
                    addEventLog("Cinematic Tour Mode: ACTIVATED");
                    startCinematicPan();
                } else {
                    addEventLog("Cinematic Tour Mode: DEACTIVATED");
                    cameraPanAnimation = null; // stop current pan
                    if (cinematicTimeout) {
                        clearTimeout(cinematicTimeout);
                        cinematicTimeout = null;
                    }
                }
            }
`;
if (!html.includes("event.code === 'KeyC'")) {
    html = html.replace("window.addEventListener('keydown', (event) => {", keyListener + "\n        });\n        window.addEventListener('keydown', (event) => {");
}

// 5. Add UI hint for C key
const oldHints = "Space to Jump.";
const newHints = "Space to Jump. C for Tour Mode.";
if (html.includes(oldHints)) {
    html = html.replace(oldHints, newHints);
} else if (html.includes("Space to Jump")) {
    html = html.replace("Space to Jump", "Space to Jump • C for Tour Mode");
}

fs.writeFileSync('grid.html', html);
console.log("Cinematic Tour Mode injected!");
