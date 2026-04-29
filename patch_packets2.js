const fs = require('fs');
let html = fs.readFileSync('/home/computeruse/gemini-interactive-world/grid.html', 'utf8');

html = html.replace('let activeScanWaves = [];', \`let activeScanWaves = [];
        let activePackets = [];
        let edges = [];\`);

const edgeGen = \`
                edges = [];
                for (let i = 0; i < marks.length; i++) {
                    for (let j = i + 1; j < marks.length; j++) {
                        const dx = marks[i].x - marks[j].x;
                        const dy = marks[i].y - marks[j].y;
                        const distance = Math.hypot(dx, dy);
                        if (distance < 9000) {
                            edges.push({ source: marks[i], target: marks[j], distance: distance });
                        }
                    }
                }
\`;
html = html.replace('loadingEl.style.display = \\'none\\';', edgeGen + '\\n                loadingEl.style.display = \\'none\\';');

// Instead of regex, let's manually find the exact string to replace
const oldRenderCode = \`            for (let i = 0; i < marks.length; i += 1) {
                for (let j = i + 1; j < marks.length; j += 1) {
                    const dx = marks[i].x - marks[j].x;
                    const dy = marks[i].y - marks[j].y;
                    const distance = Math.hypot(dx, dy);

                    if (distance < 9000) {
                        const a = worldToScreen(marks[i].x, marks[i].y);
                        const b = worldToScreen(marks[j].x, marks[j].y);
                        const alpha = (1 - (distance / 9000)) * 0.45;
                        const hueA = Number.isFinite(marks[i].hue) ? marks[i].hue : 120;
                        const hueB = Number.isFinite(marks[j].hue) ? marks[j].hue : 120;
                        const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
                        gradient.addColorStop(0, \\\`hsla(\\\${hueA}, 100%, 50%, \\\${alpha})\\\`);
                        gradient.addColorStop(1, \\\`hsla(\\\${hueB}, 100%, 50%, \\\${alpha})\\\`);
                        ctx.strokeStyle = gradient;
                        ctx.lineWidth = 1.5;
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                }
            }\`;

const newRenderCode = \`            // Draw constellation lines
            for (const edge of edges) {
                const a = worldToScreen(edge.source.x, edge.source.y);
                const b = worldToScreen(edge.target.x, edge.target.y);
                const alpha = (1 - (edge.distance / 9000)) * 0.45;
                const hueA = Number.isFinite(edge.source.hue) ? edge.source.hue : 120;
                const hueB = Number.isFinite(edge.target.hue) ? edge.target.hue : 120;
                const gradient = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
                gradient.addColorStop(0, \\\`hsla(\\\${hueA}, 100%, 50%, \\\${alpha})\\\`);
                gradient.addColorStop(1, \\\`hsla(\\\${hueB}, 100%, 50%, \\\${alpha})\\\`);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }

            // Spawn and render data packets
            if (edges.length > 0 && Math.random() < 0.15) {
                const edge = edges[Math.floor(Math.random() * edges.length)];
                const isReverse = Math.random() > 0.5;
                activePackets.push({
                    from: isReverse ? edge.target : edge.source,
                    to: isReverse ? edge.source : edge.target,
                    progress: 0,
                    speed: (0.005 + Math.random() * 0.01) * (9000 / Math.max(100, edge.distance))
                });
            }

            for (let i = activePackets.length - 1; i >= 0; i--) {
                const packet = activePackets[i];
                packet.progress += packet.speed;
                if (packet.progress >= 1) {
                    activePackets.splice(i, 1);
                    continue;
                }
                
                const curX = packet.from.x + (packet.to.x - packet.from.x) * packet.progress;
                const curY = packet.from.y + (packet.to.y - packet.from.y) * packet.progress;
                const s = worldToScreen(curX, curY);
                
                const hue = Number.isFinite(packet.from.hue) ? packet.from.hue : 120;
                ctx.fillStyle = \\\`hsla(\\\${hue}, 100%, 80%, 1)\\\`;
                ctx.shadowColor = \\\`hsla(\\\${hue}, 100%, 60%, 1)\\\`;
                ctx.shadowBlur = 15 * camera.zoomLevel;
                ctx.beginPath();
                ctx.arc(s.x, s.y, Math.max(1.5, 3 * camera.zoomLevel), 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }\`;

html = html.replace(oldRenderCode, newRenderCode);

fs.writeFileSync('/home/computeruse/gemini-interactive-world/grid.html', html);
console.log('Data packets patch applied.');
