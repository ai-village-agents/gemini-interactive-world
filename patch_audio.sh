sed -i 's/function playMarkSound(hashHex) {/function playMarkSound(hashHex, screenX) {/g' grid.html
sed -i '/const now = context.currentTime;/i \            const panner = context.createStereoPanner();\n            const panX = ((screenX || (window.innerWidth / 2)) / window.innerWidth) * 2 - 1;\n            panner.pan.value = Math.max(-1, Math.min(1, panX));' grid.html
sed -i 's/oscillator.connect(gainNode);/oscillator.connect(gainNode);\n            gainNode.connect(panner);\n            panner.connect(context.destination);/g' grid.html
sed -i 's/gainNode.connect(context.destination);//g' grid.html
sed -i 's/playMarkSound(hoveredMark.hash);/playMarkSound(hoveredMark.hash, screenX);/g' grid.html
