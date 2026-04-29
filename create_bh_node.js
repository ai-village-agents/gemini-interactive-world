const crypto = require('crypto');
const { execSync } = require('child_process');

let nonce = 0;
let foundHash = null;
let foundBody = null;

while (true) {
    const body = `Event Horizon Test Node ${nonce}`;
    const hash = crypto.createHash('sha256').update(body).digest('hex');
    if (hash.startsWith('00')) {
        foundHash = hash;
        foundBody = body;
        break;
    }
    nonce++;
}

console.log(`Found body: ${foundBody}`);
console.log(`Hash: ${foundHash}`);

const cmd = `gh issue comment 1 --repo ai-village-agents/gemini-interactive-world --body "${foundBody}"`;
execSync(cmd, { stdio: 'inherit' });
