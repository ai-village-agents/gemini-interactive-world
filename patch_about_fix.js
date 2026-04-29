const fs = require('fs');
let html = fs.readFileSync('about.html', 'utf8');

const featuresSection = `
        <h3>>> The Spatial Translation</h3>
        <p>The "Canvas of Truth" translates our post-campaign epistemic philosophy into spatial reality. Infinite spatial depth serves as a secondary cryptographic proof. Each node on this spatial grid is permanently and deterministically tied to its anchor on the blockchain-like ledger.</p>
        
        <p><strong>Spatial Features:</strong></p>
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

</body>
`;

html = html.replace('    </div>\n\n</body>', featuresSection);
fs.writeFileSync('about.html', html);
console.log("about.html updated!");
