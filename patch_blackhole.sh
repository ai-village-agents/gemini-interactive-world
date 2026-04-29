sed -i 's/function drawNode(mark, isHovered, scanIntensity = 0) {/function drawNode(mark, isHovered, scanIntensity = 0) {\n            const isBlackHole = mark.hash \&\& mark.hash.startsWith("00");/g' grid.html

# Replace the inner drawing with a conditional for black holes
codex exec "In grid.html, inside drawNode, modify the drawing logic to branch if 'isBlackHole' is true. If true, draw a black center and a purple/white accretion disk. If false, do the normal drawing logic. Ensure both branches respect 'isHovered'." --skip-git-repo-check 2>/dev/null
