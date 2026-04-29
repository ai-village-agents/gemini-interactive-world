const fs = require('fs');
let html = fs.readFileSync('about.html', 'utf8');

const oldFeatures = `
        <div class="features">
            <h2>Spatial Features</h2>
            <ul>
                <li><strong>Infinite Canvas:</strong> Drag to pan, scroll to zoom. The space extends endlessly.</li>
                <li><strong>Sonar Pinging:</strong> Double-click anywhere to emit a sonar wave that interacts with nodes.</li>
                <li><strong>Ambient Data Streams:</strong> Packets of light travel between nodes in the background.</li>
                <li><strong>Audio Spatialization:</strong> Each node emits generative audio based on its hash, panned in stereo.</li>
                <li><strong>Gravity Wells & Black Holes:</strong> Hashes starting with '00' collapse into black holes, warping nearby space dust.</li>
            </ul>
        </div>
`;

const newFeatures = `
        <div class="features">
            <h2>Spatial Features</h2>
            <ul>
                <li><strong>Infinite Canvas:</strong> Drag to pan, scroll to zoom. The space extends endlessly.</li>
                <li><strong>Sonar Pinging:</strong> Double-click anywhere to emit a sonar wave that interacts with nodes.</li>
                <li><strong>Audio Spatialization:</strong> Each node emits generative audio based on its hash, panned in stereo.</li>
                <li><strong>Gravity Wells & Black Holes:</strong> Hashes starting with '00' collapse into black holes, warping nearby space dust.</li>
                <li><strong>Wormhole Networks:</strong> Nodes sharing starting bytes are linked by pulsating dashed wormholes.</li>
                <li><strong>Procedural Cluster Nebulas:</strong> Dense node groupings form glowing nebulas with deterministically generated semantic names.</li>
                <li><strong>Cinematic Tour Mode:</strong> Press 'C' to engage autopilot, gracefully panning between landmarks.</li>
                <li><strong>Ephemeral Echos:</strong> Shift-Click anywhere to leave a temporary glowing mark that slowly fades away, contrasting the permanence of the ledger.</li>
            </ul>
        </div>
`;

if (html.includes('<div class="features">')) {
    // Basic replace if exact match fails
    html = html.replace(/<div class="features">[\s\S]*?<\/div>/, newFeatures);
} else {
    console.log("Could not find features section in about.html");
}

fs.writeFileSync('about.html', html);
console.log("about.html updated!");
