const fs = require('fs');
let html = fs.readFileSync('/home/computeruse/gemini-interactive-world/grid.html', 'utf8');

// 1. Add activeScanWaves array
html = html.replace('let currentGainNode = null;', "let currentGainNode = null;\n        let activeScanWaves = [];\n        const WAVE_SPEED = 250;\n        const WAVE_MAX_RADIUS = 15000;");

// 2. Add function to spawn a wave
const spawnWaveFunc = `
        function spawnScanWave(worldX, worldY) {
            ensureAudioContext();
            activeScanWaves.push({
                x: worldX,
                y: worldY,
                radius: 0,
                maxRadius: WAVE_MAX_RADIUS,
                speed: WAVE_SPEED,
                active: true
            });
            
            // Play a low frequency "ping" sound
            if (audioContext) {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(40, audioContext.currentTime);
                osc.frequency.exponentialRampToValueAtTime(10, audioContext.currentTime + 1.5);
                gain.gain.setValueAtTime(0.3, audioContext.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1.5);
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.start();
                osc.stop(audioContext.currentTime + 1.6);
            }
        }
`;
html = html.replace('function ensureAudioContext() {', spawnWaveFunc + '\n        function ensureAudioContext() {');

// 3. Add mark scan collision state
html = html.replace('let marks = [];', 'let marks = [];');

// Modify drawNode to accept a scanIntensity parameter
html = html.replace('function drawNode(mark, isHovered) {', 'function drawNode(mark, isHovered, scanIntensity = 0) {');

// In drawNode, boost the brightness if scanIntensity > 0
const drawNodeContent = `            const s = worldToScreen(mark.x, mark.y);
            const baseRadius = getNodeRadiusPx();
            const radius = isHovered ? baseRadius * 1.3 : baseRadius;
            const hue = Number.isFinite(mark.hue) ? mark.hue : 120;
            const intensityBonus = scanIntensity * 1.5; // Up to 150% extra brightness
            
            // Adjust lightness based on scan
            const baseLightness = 50;
            const currentLightness = Math.min(100, baseLightness + (intensityBonus * 50));
            const alphaBoost = scanIntensity * 0.4;`;

html = html.replace(/            const s = worldToScreen\(mark\.x, mark\.y\);[\s\S]*?const hue = Number\.isFinite\(mark\.hue\) \? mark\.hue : 120;/m, drawNodeContent);

// Replace glow stops in drawNode
html = html.replace(/glow\.addColorStop\(0, isHovered \? 'rgba\(255, 255, 255, 0\.65\)' : `hsla\(\$\{hue\}, 100%, 50%, 0\.52\)`\);/, "glow.addColorStop(0, isHovered ? 'rgba(255, 255, 255, 0.8)' : `hsla(${hue}, 100%, ${currentLightness}%, ${0.52 + alphaBoost})`);");
html = html.replace(/glow\.addColorStop\(0\.35, isHovered \? `hsla\(\$\{hue\}, 100%, 68%, 0\.32\)` : `hsla\(\$\{hue\}, 100%, 50%, 0\.2\)`\);/, "glow.addColorStop(0.35, isHovered ? `hsla(${hue}, 100%, 68%, 0.5)` : `hsla(${hue}, 100%, ${Math.min(100, currentLightness - 10)}%, ${0.2 + (alphaBoost/2)})`);");

// Replace inner circles in drawNode
html = html.replace(/ctx\.fillStyle = isHovered \? '#ffffff' : `hsla\(\$\{hue\}, 100%, 50%, 0\.95\)`\);/, "ctx.fillStyle = isHovered ? '#ffffff' : `hsla(${hue}, 100%, ${currentLightness}%, ${Math.min(1, 0.95 + alphaBoost)})`;");
html = html.replace(/ctx\.fillStyle = isHovered \? `hsla\(\$\{hue\}, 100%, 86%, 0\.9\)` : `hsla\(\$\{hue\}, 100%, 50%, 0\.72\)`\);/, "ctx.fillStyle = isHovered ? `hsla(${hue}, 100%, 86%, 0.9)` : `hsla(${hue}, 100%, ${Math.min(100, currentLightness - 5)}%, ${Math.min(1, 0.72 + alphaBoost)})`;");
html = html.replace(/ctx\.fillStyle = isHovered \? `hsla\(\$\{hue\}, 100%, 78%, 0\.6\)` : `hsla\(\$\{hue\}, 100%, 50%, 0\.45\)`\);/, "ctx.fillStyle = isHovered ? `hsla(${hue}, 100%, 78%, 0.6)` : `hsla(${hue}, 100%, ${Math.min(100, currentLightness - 15)}%, ${Math.min(1, 0.45 + alphaBoost)})`;");


// 4. Update render loop to process waves
const renderWaves = `
            // Update and draw scan waves
            for (let i = activeScanWaves.length - 1; i >= 0; i--) {
                const wave = activeScanWaves[i];
                wave.radius += wave.speed;
                
                if (wave.radius > wave.maxRadius) {
                    activeScanWaves.splice(i, 1);
                    continue;
                }
                
                const s = worldToScreen(wave.x, wave.y);
                const screenRadius = wave.radius * camera.zoomLevel;
                const alpha = Math.max(0, 1 - (wave.radius / wave.maxRadius));
                
                ctx.beginPath();
                ctx.arc(s.x, s.y, screenRadius, 0, Math.PI * 2);
                ctx.strokeStyle = \`rgba(0, 255, 102, \${alpha * 0.8})\`;
                ctx.lineWidth = 3;
                ctx.stroke();
                
                ctx.beginPath();
                ctx.arc(s.x, s.y, screenRadius - 5, 0, Math.PI * 2);
                ctx.strokeStyle = \`rgba(0, 255, 102, \${alpha * 0.3})\`;
                ctx.lineWidth = 8;
                ctx.stroke();
            }
`;

html = html.replace('for (let i = 0; i < marks.length; i += 1) {', renderWaves + '\n            for (let i = 0; i < marks.length; i += 1) {');

// 5. Update drawNode call in render loop to pass scanIntensity
const renderNodes = `            for (const mark of marks) {
                let scanIntensity = 0;
                for (const wave of activeScanWaves) {
                    const dist = Math.hypot(mark.x - wave.x, mark.y - wave.y);
                    const diff = Math.abs(dist - wave.radius);
                    const waveWidth = 800; // World units width of the wave effect
                    
                    if (diff < waveWidth) {
                        const intensity = 1 - (diff / waveWidth);
                        scanIntensity = Math.max(scanIntensity, intensity * (1 - wave.radius/wave.maxRadius));
                        
                        // Play a tiny ping if hit dead on
                        if (diff < wave.speed && audioContext && Math.random() > 0.5) {
                             const osc = audioContext.createOscillator();
                             const gain = audioContext.createGain();
                             osc.type = 'sine';
                             const hashInt = Number.parseInt(mark.hash.substring(0,4), 16) || 1000;
                             osc.frequency.setValueAtTime(800 + (hashInt % 1000), audioContext.currentTime);
                             gain.gain.setValueAtTime(0.05 * (1 - wave.radius/wave.maxRadius), audioContext.currentTime);
                             gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.1);
                             osc.connect(gain);
                             gain.connect(audioContext.destination);
                             osc.start();
                             osc.stop(audioContext.currentTime + 0.12);
                        }
                    }
                }
                drawNode(mark, hoveredMark && hoveredMark.id === mark.id, scanIntensity);
            }`;

html = html.replace(/            for \(const mark of marks\) \{\n                drawNode\(mark, hoveredMark && hoveredMark\.id === mark\.id\);\n            \}/, renderNodes);


// 6. Bind dblclick event to canvas
const dblclickEvent = `
        canvas.addEventListener('dblclick', (event) => {
            const worldCoords = screenToWorld(event.clientX, event.clientY);
            spawnScanWave(worldCoords.x, worldCoords.y);
        });
`;

html = html.replace("window.addEventListener('resize', resizeCanvas);", dblclickEvent + "\n        window.addEventListener('resize', resizeCanvas);");

// 7. Update instruction text
html = html.replace('Drag to pan. Scroll to zoom. Hover a mark to read it. Click a hovered mark to verify its ledger anchor.', 'Drag to pan. Scroll to zoom. Dbl-Click to send a sonar ping. Click a mark to verify.');

fs.writeFileSync('/home/computeruse/gemini-interactive-world/grid.html', html);
console.log('Sonar patch applied.');
