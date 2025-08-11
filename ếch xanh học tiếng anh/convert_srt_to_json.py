#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
SRT to JSON Converter for Suite Life of Zack and Cody
Converts SRT subtitle files to JSON format matching episode 2 structure
"""

import re
import json
import os
from pathlib import Path

def parse_srt_time(time_str):
    """Convert SRT timestamp to seconds"""
    # Format: 00:00:03,602 -> 3.602
    time_str = time_str.replace(',', '.')
    parts = time_str.split(':')
    hours = int(parts[0])
    minutes = int(parts[1])
    seconds = float(parts[2])
    return hours * 3600 + minutes * 60 + seconds

def convert_srt_to_json(srt_file_path):
    """Convert SRT file to JSON format matching episode 2 structure"""
    print(f"🎬 Converting {srt_file_path}...")
    
    with open(srt_file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Split by double newlines to get subtitle blocks
    blocks = re.split(r'\n\s*\n', content.strip())
    
    subtitles = []
    
    for block in blocks:
        if not block.strip():
            continue
            
        lines = block.strip().split('\n')
        if len(lines) < 3:
            continue
            
        # Skip subtitle number (first line)
        # Second line contains timestamps
        time_line = lines[1]
        
        # Parse timestamps: 00:00:03,602 --> 00:00:05,437
        time_match = re.match(r'(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})', time_line)
        if not time_match:
            continue
            
        start_time = parse_srt_time(time_match.group(1))
        end_time = parse_srt_time(time_match.group(2))
        
        # Join remaining lines as subtitle text
        text = ' '.join(lines[2:])
        
        # Clean up text (remove formatting, excessive spaces)
        text = re.sub(r'<[^>]+>', '', text)  # Remove HTML tags
        text = re.sub(r'\s+', ' ', text).strip()  # Normalize spaces
        
        if text:
            subtitle = {
                "start": round(start_time, 2),
                "end": round(end_time, 2),
                "en": text,
                "vi": ""
            }
            subtitles.append(subtitle)
    
    print(f"✅ Converted {len(subtitles)} subtitles from {srt_file_path}")
    return subtitles

def main():
    """Convert all SRT files to JSON format"""
    
    # File mappings
    srt_files = {
        'S01E01': 'The.Suite.Life.of.Zack.and.Cody.S01E01.WEBRip.x264-SRS.srt',
        'S01E02': 'The.Suite.Life.of.Zack.and.Cody.S01E02.WEBRip.x264-SRS.srt',
        'S01E03': 'The.Suite.Life.of.Zack.and.Cody.S01E03.WEBRip.x264-SRS.srt',
        'S01E04': 'Suite Life S1 E4.srt',
        'S01E05': 'The.Suite.Life.of.Zack.and.Cody.S01E05.WEBRip.x264-SRS.srt'
    }
    
    output_dir = Path('subs')
    output_dir.mkdir(exist_ok=True)
    
    print("🎯 Converting Suite Life SRT files to JSON format...")
    print("=" * 60)
    
    for episode, srt_file in srt_files.items():
        if os.path.exists(srt_file):
            try:
                subtitles = convert_srt_to_json(srt_file)
                
                # Create output filename
                output_file = output_dir / f'suite-life_{episode.lower()}_complete.json'
                
                # Write JSON file
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(subtitles, f, ensure_ascii=False, indent=2)
                
                print(f"📁 Saved: {output_file} ({len(subtitles)} subtitles)")
                
            except Exception as e:
                print(f"❌ Error converting {srt_file}: {e}")
        else:
            print(f"⚠️  File not found: {srt_file}")
    
    print("=" * 60)
    print("🎉 Conversion completed!")
    print("\n📋 Summary:")
    print("- All SRT files converted to JSON format")
    print("- Format matches episode 2 structure (en/vi fields)")
    print("- Files saved in 'subs/' directory")
    print("- Ready for integration with video platform!")

if __name__ == "__main__":
    main()
