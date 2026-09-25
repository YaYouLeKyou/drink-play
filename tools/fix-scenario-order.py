#!/usr/bin/env python3
# Fix scenario timeline: reorder Act 1 - Phase 1 pages

filepath = 'true-detective/phases.js'
with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Find act1_1 section
act1_1_marker = "id: 'act1_1'"
act1_2_marker = "id: 'act1_2'"

act1_1_start = content.find(act1_1_marker)
act1_2_start = content.find(act1_2_marker)

if act1_1_start == -1 or act1_2_start == -1:
    print('ERROR: Could not find act1_1 or act1_2')
    exit(1)

# Extract act1_1 section
act1_1_section = content[act1_1_start:act1_2_start]

# Find pages array - look for the closing bracket that ends the pages array
pages_start = act1_1_section.find('pages: [')
# Find the matching closing bracket
pages_end = pages_start
bracket_count = 0
for i in range(pages_start, len(act1_1_section)):
    if act1_1_section[i] == '[':
        bracket_count += 1
    elif act1_1_section[i] == ']':
        bracket_count -= 1
        if bracket_count == 0:
            pages_end = i + 1
            break

pages_section = act1_1_section[pages_start:pages_end]

print('Pages section length:', len(pages_section))
print('First 200 chars:')
print(pages_section[:200])
print('...')

# Split into individual pages by finding each page start
page_markers = [
    "npc: 'protecteur'",
    "npc: 'femme-fatale'", 
    "La montre du Duc gît",
    "minigame: { type: 'montre_code'",
    "Après examen"
]

page_starts = []
for marker in page_markers:
    pos = pages_section.find(marker)
    if pos != -1:
        page_starts.append(pos)
    else:
        print(f'WARNING: Could not find marker: {marker}')

page_starts.sort()

print(f'Found {len(page_starts)} page markers at positions: {page_starts}')

# Extract pages
pages = []
for i, start in enumerate(page_starts):
    if i + 1 < len(page_starts):
        end = page_starts[i + 1]
    else:
        end = pages_section.find(']', start)
    page = pages_section[start:end].rstrip(', ')
    pages.append(page)

print(f'\nFound {len(pages)} pages:')
for i, page in enumerate(pages):
    print(f'  Page {i+1}: {page[:100]}...')

# Reorder: watch dialogue (3), watch game (4), after exam (5), protector (1), femme (2)
if len(pages) >= 5:
    reordered = [pages[2], pages[3], pages[4], pages[0], pages[1]]
    new_pages_section = 'pages: [\n            ' + ',\n            '.join(reordered) + ']'
    
    # Replace in act1_1 section
    new_act1_1_section = act1_1_section[:pages_start] + new_pages_section + act1_1_section[pages_end:]
    
    # Replace in main content
    content = content.replace(act1_1_section, new_act1_1_section)
    
    # Write back
    with open(filepath, 'w', encoding='utf-8', errors='replace') as f:
        f.write(content)
    
    print('\nSUCCESS: Reordered Act 1 - Phase 1 pages')
    print('New order: Watch dialogue -> Watch game -> After examination -> Protector interrogation -> Femme-fatale interrogation')
else:
    print('ERROR: Not enough pages found')
    exit(1)
