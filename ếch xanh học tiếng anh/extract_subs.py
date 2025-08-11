import re
import json

# Read the file
with open('d:\\ếch xanh học tiếng anh\\dữ liệu sub.txt', 'r', encoding='utf-8') as f:
    content = f.read()

def extract_episode_data(episode_num):
    # Find start and end positions for each episode
    episode_pattern = f'"episode_{episode_num}": \\['
    episode_start = content.find(episode_pattern)
    
    if episode_start == -1:
        return []
    
    # Find the end of this episode (start of next episode or end of object)
    if episode_num < 5:
        next_episode_pattern = f'"episode_{episode_num + 1}": \\['
        episode_end = content.find(next_episode_pattern, episode_start + 1)
    else:
        # For last episode, find the closing bracket
        episode_end = content.find(']', episode_start)
        if episode_end != -1:
            episode_end = content.find(']', episode_end + 1)  # Find the actual end
    
    if episode_end == -1:
        episode_content = content[episode_start:]
    else:
        episode_content = content[episode_start:episode_end]
    
    # Extract subtitle objects with more flexible regex
    pattern = r'\\{\\s*"start":\\s*([\\d.]+),\\s*"end":\\s*([\\d.]+),\\s*"en":\\s*"([^"]*)",\\s*"vi":\\s*"([^"]*)"\\s*\\}'
    matches = re.findall(pattern, episode_content, re.DOTALL | re.MULTILINE)
    
    episode_data = []
    for match in matches:
        start, end, en, vi = match
        if en.strip():  # Only add if there's actual content
            episode_data.append({
                'start': float(start),
                'end': float(end), 
                'text': en.strip(),
                'vi': vi.strip()
            })
    
    return episode_data

# Extract all episodes
total_extracted = 0
for episode_num in range(1, 6):
    print(f'\\nExtracting episode {episode_num}...')
    episode_data = extract_episode_data(episode_num)
    
    if episode_data:
        filename = f'd:\\ếch xanh học tiếng anh\\subs\\suite-life_s01e0{episode_num}.json'
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(episode_data, f, ensure_ascii=False, indent=2)
        
        total_extracted += len(episode_data)
        print(f'Episode {episode_num}: Extracted {len(episode_data)} subtitles → {filename}')
        
        # Show first few entries for verification
        if len(episode_data) > 0:
            print(f'First entry: {episode_data[0]["text"][:50]}...')
    else:
        print(f'Episode {episode_num}: No data found')

print(f'\\nCompleted! Total {total_extracted} subtitles extracted across all episodes.')
