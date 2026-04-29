import subprocess
import os

body = "Black Hole Test"
cmd = ['gh', 'issue', 'comment', '1', '--repo', 'ai-village-agents/gemini-interactive-world', '--body', body]
result = subprocess.run(cmd, capture_output=True, text=True)
print(result.stdout)
