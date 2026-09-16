import re

css_map = {
    'var(--ink)': 'var(--text-primary)',
    'var(--muted)': 'var(--text-secondary)',
    'var(--line)': 'var(--border-color)',
    'var(--paper)': 'var(--bg-main)',
    'var(--lime)': 'var(--accent-secondary)',
    'var(--deep)': 'var(--accent-primary)',
    'var(--cream)': 'var(--mood-bg)',
    '#fff': 'var(--bg-panel)',
    'white': 'var(--bg-panel)',
    '#58615d': 'var(--text-secondary)',
    '#fbfcfa': 'var(--bg-main)',
    '#f3f7ee': 'var(--item-bg-hover)',
    '#cbd2cb': 'var(--border-color)',
    '#101e1b': 'var(--accent-primary-hover)',
    '#7ea916': 'var(--indicator)',
    '#f6f3ed': 'var(--mood-border)',
    '#2e3936': 'var(--accent-primary)',
    '#c7c2b7': 'var(--border-color)',
    '#e7e2d5': 'var(--border-color)',
    '#b4d2d2': 'var(--accent-secondary)',
    '#365052': 'var(--accent-secondary-text)',
    '#9a8062': 'var(--mood-arch1)',
    '#2c3835': 'var(--accent-primary)',
    '#b69d7d': 'var(--mood-arch1)',
    '#a7c8c4': 'var(--mood-border)',
    '#d5e6df': 'var(--mood-bg)',
    '#31514d': 'var(--text-primary)',
    '#615b51': 'var(--text-secondary)',
    '#b5aa92': 'var(--mood-arch1)',
    '#d9d0be': 'var(--mood-arch2)',
    '#e9e1d1': 'var(--mood-border)',
    '#c9deda': 'var(--mood-arch2)',
    '#d7c4a4': 'var(--mood-arch1)',
    '#8c9f99': 'var(--border-color)',
    '#3e4d21': 'var(--accent-secondary-text)',
    '#809b15': 'var(--indicator)',
    '#9db53f': 'var(--border-color)',
    '#f4f9d8': 'var(--item-bg-hover)'
}

def replace_css(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    if filepath.endswith('styles.css'):
        content = re.sub(r':root\{[^\}]+\}', '', content)
    
    for old, new in css_map.items():
        content = content.replace(old, new)
        
    if filepath.endswith('styles.css'):
        new_roots = """
:root, [data-theme="Minimalist Modern"] {
  --bg-main: #f4f5f6; --bg-panel: #ffffff; --text-primary: #111418; --text-secondary: #6b7280; --border-color: #e5e7eb;
  --accent-primary: #111827; --accent-primary-hover: #000000; --accent-secondary: #e5e7eb; --accent-secondary-text: #374151;
  --mood-bg: #f9fafb; --mood-arch1: #d1d5db; --mood-arch2: #e5e7eb; --mood-border: #f3f4f6; --item-bg-hover: #f9fafb; --indicator: #3b82f6;
}
[data-theme="Japanese Zen"] {
  --bg-main: #f8f8f4; --bg-panel: #ffffff; --text-primary: #17211f; --text-secondary: #69736e; --border-color: #dce1dc;
  --accent-primary: #243d38; --accent-primary-hover: #101e1b; --accent-secondary: #d9ee6d; --accent-secondary-text: #3e4d21;
  --mood-bg: #f2eee4; --mood-arch1: #b5aa92; --mood-arch2: #d9d0be; --mood-border: #e9e1d1; --item-bg-hover: #f3f7ee; --indicator: #7ea916;
}
[data-theme="Classic Luxury"] {
  --bg-main: #fdfdfd; --bg-panel: #ffffff; --text-primary: #0f172a; --text-secondary: #64748b; --border-color: #cbd5e1;
  --accent-primary: #1e293b; --accent-primary-hover: #0f172a; --accent-secondary: #fef3c7; --accent-secondary-text: #92400e;
  --mood-bg: #f8fafc; --mood-arch1: #94a3b8; --mood-arch2: #cbd5e1; --mood-border: #f1f5f9; --item-bg-hover: #f8fafc; --indicator: #b45309;
}
body, .design-panel, .control-panel, .layout-card, .mood-card, .impact, .theme, .scan-button, .product-symbol, .arch-one, .arch-two, .fixture, .room, .window, .door {
  transition: background-color 0.4s ease, border-color 0.4s ease, color 0.4s ease;
}
"""
        content = new_roots + content
    
    with open(filepath, 'w') as f:
        f.write(content)

replace_css('c:/Users/HP/Desktop/kohler/styles.css')
replace_css('c:/Users/HP/Desktop/kohler/dynamic.css')
