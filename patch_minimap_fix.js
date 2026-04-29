const fs = require('fs');
let html = fs.readFileSync('grid.html', 'utf8');

const oldMinimapRender = `            ctx.fillStyle = 'rgba(0, 255, 102, 0.8)';
            for (const mark of marks) {
                const mx = mapLeft + worldToMinimap(mark.x);
                const my = mapTop + worldToMinimap(mark.y);
                ctx.fillRect(mx, my, 1, 1);
            }`;

const newMinimapRender = `
            // Render Wormhole links on minimap first
            ctx.beginPath();
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            const drawnLinksMinimap = new Set();
            for (const mark of marks) {
                if (mark.hash && mark.hash.length >= 2) {
                    const prefix = mark.hash.substring(0, 2);
                    for (const other of marks) {
                        if (mark !== other && other.hash && other.hash.startsWith(prefix)) {
                            const linkId1 = mark.id + '-' + other.id;
                            const linkId2 = other.id + '-' + mark.id;
                            if (!drawnLinksMinimap.has(linkId1) && !drawnLinksMinimap.has(linkId2)) {
                                drawnLinksMinimap.add(linkId1);
                                ctx.moveTo(mapLeft + worldToMinimap(mark.x), mapTop + worldToMinimap(mark.y));
                                ctx.lineTo(mapLeft + worldToMinimap(other.x), mapTop + worldToMinimap(other.y));
                            }
                        }
                    }
                }
            }
            ctx.stroke();

            // Render marks and Black Holes on minimap
            for (const mark of marks) {
                const mx = mapLeft + worldToMinimap(mark.x);
                const my = mapTop + worldToMinimap(mark.y);
                
                if (mark.hash && mark.hash.startsWith("00")) {
                    // Black hole dot
                    ctx.fillStyle = '#000000';
                    ctx.fillRect(mx-1, my-1, 3, 3);
                    // Accretion glow dot
                    const hue = Number.isFinite(mark.hue) ? mark.hue : 120;
                    ctx.fillStyle = \`hsl(\${hue}, 100%, 50%)\`;
                    ctx.fillRect(mx, my, 1, 1);
                } else {
                    const hue = Number.isFinite(mark.hue) ? mark.hue : 120;
                    ctx.fillStyle = \`hsl(\${hue}, 100%, 70%)\`;
                    ctx.fillRect(mx, my, 1, 1);
                }
            }
`;

if (html.includes(oldMinimapRender)) {
    html = html.replace(oldMinimapRender, newMinimapRender);
} else {
    console.log("Could not find minimap render loop");
}

fs.writeFileSync('grid.html', html);
console.log("Minimap enhancements injected!");
