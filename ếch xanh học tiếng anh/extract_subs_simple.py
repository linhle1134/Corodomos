import re
import json

print("Starting subtitle extraction...")

# Read the file
try:
    with open('d:\\ếch xanh học tiếng anh\\dữ liệu sub.txt', 'r', encoding='utf-8') as f:
        content = f.read()
    print(f"File loaded, size: {len(content)} characters")
except Exception as e:
    print(f"Error reading file: {e}")
    exit()

# Split content by episodes
episodes_data = {}

# Find all episode sections
episode_pattern = r'"episode_(\d+)":\s*\[(.*?)\](?=\s*[,}])'
episode_matches = re.findall(episode_pattern, content, re.DOTALL)

print(f"Found {len(episode_matches)} episodes")

for episode_num, episode_content in episode_matches:
    print(f"\nProcessing episode {episode_num}...")
    
    # Find all subtitle objects in this episode
    subtitle_pattern = r'\{\s*"start":\s*([\d.]+),\s*"end":\s*([\d.]+),\s*"en":\s*"([^"]*)",\s*"vi":\s*"([^"]*)"\s*\}'
    subtitle_matches = re.findall(subtitle_pattern, episode_content)
    
    episode_data = []
    for start, end, en, vi in subtitle_matches:
        if en.strip():  # Only add if there's content
            episode_data.append({
                'start': float(start),
                'end': float(end),
                'text': en.strip(),
                'vi': vi.strip()
            })
    
    if episode_data:
        filename = f'd:\\ếch xanh học tiếng anh\\subs\\suite-life_s01e{episode_num.zfill(2)}.json'
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(episode_data, f, ensure_ascii=False, indent=2)
            print(f"Episode {episode_num}: Saved {len(episode_data)} subtitles to {filename}")
            
            # Show sample
            if len(episode_data) > 0:
                print(f"  Sample: {episode_data[0]['text'][:50]}...")
        except Exception as e:
            print(f"Error saving episode {episode_num}: {e}")
    else:
        print(f"Episode {episode_num}: No subtitles found")

print("\nExtraction completed!")
