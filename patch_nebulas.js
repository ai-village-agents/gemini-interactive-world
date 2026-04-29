const fs = require('fs');
let html = fs.readFileSync('/home/computeruse/gemini-interactive-world/grid.html', 'utf8');

// 1. Add nebulas array
const nebulasDef = `
        const nebulas = Array.from({ length: 40 }, () => ({
            x: (Math.random() * 40000) - 20000,
            y: (Math.random() * 40000) - 20000,
            radius: 2000 + (Math.random() * 6000),
            hue: Math.floor(Math.random() * 360),
            opacity: 0.03 + (Math.random() * 0.08),
            parallaxFactor: 0.2 + (Math.random() * 0.6)
        }));
`;
html = html.replace('const dust =', nebulasDef + '\n        const dust =');

// 2. Add function for parallax screen coords
const parallaxFunc = `
        function worldToScreenParallax(worldX, worldY, parallaxFactor) {
            return {
                x: (worldX - (camera.offsetX * parallaxFactor)) * camera.zoomLevel + (canvas.clientWidth / 2),
                y: (worldY - (camera.offsetY * parallaxFactor)) * camera.zoomLevel + (canvas.clientHeight / 2)
            };
        }
`;
html = html.replace('function worldToScreen(worldX, worldY) {', parallaxFunc + '\n        function worldToScreen(worldX, worldY) {');

// 3. Render nebulas in the render loop before the background grid
const renderNebulas = `
            // Draw nebulas (parallax background)
            ctx.globalCompositeOperation = 'lighter';
            for (const nebula of nebulas) {
                const s = worldToScreenParallax(nebula.x, nebula.y, nebula.parallaxFactor);
                const sRadius = nebula.radius * camera.zoomLevel;
                
                // Culling
                if (s.x + sRadius < 0 || s.x - sRadius > canvas.clientWidth || s.y + sRadius < 0 || s.y - sRadius > canvas.clientHeight) continue;
                
                const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, sRadius);
                gradient.addColorStop(0, \`hsla(\${nebula.hue}, 80%, 40%, \${nebula.opacity})\`);
                gradient.addColorStop(0.5, \`hsla(\${nebula.hue}, 70%, 25%, \${nebula.opacity * 0.5})\`);
                gradient.addColorStop(1, \`hsla(\${nebula.hue}, 60%, 15%, 0)\`);
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(s.x, s.y, sRadius, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalCompositeOperation = 'source-over';
`;

html = html.replace('drawBackgroundGrid();', renderNebulas + '\n            drawBackgroundGrid();');

fs.writeFileSync('/home/computeruse/gemini-interactive-world/grid.html', html);
console.log('Nebulas patch applied.');
