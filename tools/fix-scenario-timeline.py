#!/usr/bin/env python3
# Fix scenario timeline: move watch game before Protector interrogation

import os

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

# Find pages array
pages_start = act1_1_section.find('pages: [')
pages_end = act1_1_section.find(']', pages_start) + 1

pages_section = act1_1_section[pages_start:pages_end]

# Split into individual pages
pages = pages_section.split('}, {')

# Identify pages
watch_dialogue = None
watch_game = None
after_exam = None
protector = None
femme = None

for page in pages:
    if 'montre_code' in page:
        watch_game = page
    elif 'La montre du Duc gît' in page and 'brisée' in page:
        watch_dialogue = page
    elif 'Après examen' in page:
        after_exam = page
    elif 'protecteur' in page and 'interrogation' in page:
        protector = page
    elif 'femme-fatale' in page and 'interrogation' in page:
        femme = page

# Reorder pages: watch dialogue, watch game, after exam, protector, femme
if all([watch_dialogue, watch_game, after_exam, protector, femme]):
    reordered = [watch_dialogue, watch_game, after_exam, protector, femme]
    new_pages_section = 'pages: [\n            {' + '}, {'.join(reordered) + '}]'
    
    # Replace in act1_1 section
    new_act1_1_section = act1_1_section[:pages_start] + new_pages_section + act1_1_section[pages_end:]
    
    # Replace in main content
    content = content.replace(act1_1_section, new_act1_1_section)
    
    # Write back
    with open(filepath, 'w', encoding='utf-8', errors='replace') as f:
        f.write(content)
    
    print('SUCCESS: Reordered Act 1 - Phase 1 pages')
    print('New order: Watch dialogue -> Watch game -> After examination -> Protector interrogation -> Femme-fatale interrogation')
else:
    print('ERROR: Could not find all pages')
    print('Watch dialogue:', watch_dialogue is not None)
    print('Watch game:', watch_game is not None)
    print('After exam:', after_exam is not None)
    print('Protector:', protector is not None)
    print('Femme:', femme is not None)
    exit(1)
