import re
from pathlib import Path

file_path = Path("/home/computeruse/gemini-interactive-world/grid.html")
content = file_path.read_text()

# Find the exact prompt logic
prompt_pattern = r"document\.getElementById\('bookmark-add'\)\.addEventListener\('click',\s*\(\)\s*=>\s*\{.*?(?=\n\s*nodePanelClose\.addEventListener|\n\s*window\.addEventListener)[\s\S]*?\n\s*\}\);"
# wait, actually let's just find the function call
start_str = "document.getElementById('bookmark-add').addEventListener('click', () => {"

start_idx = content.find(start_str)
if start_idx != -1:
    end_idx = content.find("});", start_idx) + 3
    # let's be careful, there could be inner });
    # just look for the nodePanelClose string
    end_bound = content.find("nodePanelClose.addEventListener", start_idx)
    if end_bound != -1:
        old_block = content[start_idx:end_bound].strip()
        
        js_logic = """
        document.getElementById('bookmark-add').addEventListener('click', () => {
            customPromptOverlay.style.display = 'flex';
            customPromptInput.value = '';
            setTimeout(() => customPromptInput.focus(), 50);
        });

        customPromptCancel.addEventListener('click', () => {
            customPromptOverlay.style.display = 'none';
        });

        customPromptSave.addEventListener('click', () => {
            const name = customPromptInput.value.trim();
            if (!name) return;
            bookmarks.push({
                name: name,
                offsetX: camera.offsetX,
                offsetY: camera.offsetY,
                zoomLevel: camera.zoomLevel
            });
            saveBookmarks();
            renderBookmarks();
            addEventLog(`Bookmark saved: "${name}"`);
            customPromptOverlay.style.display = 'none';
        });

        customPromptInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') customPromptSave.click();
            if (e.key === 'Escape') customPromptCancel.click();
        });
        """
        content = content.replace(old_block, js_logic)
        file_path.write_text(content)
        print("Replaced!")
    else:
        print("end bound not found")
else:
    print("start str not found")

