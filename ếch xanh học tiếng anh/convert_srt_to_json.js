/**
 * SRT to JSON Converter for Suite Life of Zack and Cody
 * Converts SRT subtitle files to JSON format matching episode 2 structure
 */

const fs = require('fs');
const path = require('path');

function parseSrtTime(timeStr) {
    // Convert SRT timestamp to seconds
    // Format: 00:00:03,602 -> 3.602
    timeStr = timeStr.replace(',', '.');
    const parts = timeStr.split(':');
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    const seconds = parseFloat(parts[2]);
    return hours * 3600 + minutes * 60 + seconds;
}

function convertSrtToJson(srtFilePath) {
    console.log(`🎬 Converting ${srtFilePath}...`);
    
    const content = fs.readFileSync(srtFilePath, 'utf-8');
    
    // Split by double newlines to get subtitle blocks
    const blocks = content.trim().split(/\n\s*\n/);
    
    const subtitles = [];
    
    for (const block of blocks) {
        if (!block.trim()) continue;
        
        const lines = block.trim().split('\n');
        if (lines.length < 3) continue;
        
        // Skip subtitle number (first line)
        // Second line contains timestamps
        const timeLine = lines[1];
        
        // Parse timestamps: 00:00:03,602 --> 00:00:05,437
        const timeMatch = timeLine.match(/(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})/);
        if (!timeMatch) continue;
        
        const startTime = parseSrtTime(timeMatch[1]);
        const endTime = parseSrtTime(timeMatch[2]);
        
        // Join remaining lines as subtitle text
        let text = lines.slice(2).join(' ');
        
        // Clean up text (remove formatting, excessive spaces)
        text = text.replace(/<[^>]+>/g, ''); // Remove HTML tags
        text = text.replace(/\s+/g, ' ').trim(); // Normalize spaces
        
        if (text) {
            const subtitle = {
                start: Math.round(startTime * 100) / 100,
                end: Math.round(endTime * 100) / 100,
                en: text,
                vi: ""
            };
            subtitles.push(subtitle);
        }
    }
    
    console.log(`✅ Converted ${subtitles.length} subtitles from ${srtFilePath}`);
    return subtitles;
}

function main() {
    console.log("🎯 Converting Suite Life SRT files to JSON format...");
    console.log("=".repeat(60));
    
    // File mappings
    const srtFiles = {
        'S01E01': 'The.Suite.Life.of.Zack.and.Cody.S01E01.WEBRip.x264-SRS.srt',
        'S01E02': 'The.Suite.Life.of.Zack.and.Cody.S01E02.WEBRip.x264-SRS.srt',
        'S01E03': 'The.Suite.Life.of.Zack.and.Cody.S01E03.WEBRip.x264-SRS.srt',
        'S01E04': 'Suite Life S1 E4.srt',
        'S01E05': 'The.Suite.Life.of.Zack.and.Cody.S01E05.WEBRip.x264-SRS.srt'
    };
    
    const outputDir = 'subs';
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    
    for (const [episode, srtFile] of Object.entries(srtFiles)) {
        if (fs.existsSync(srtFile)) {
            try {
                const subtitles = convertSrtToJson(srtFile);
                
                // Create output filename
                const outputFile = path.join(outputDir, `suite-life_${episode.toLowerCase()}_complete.json`);
                
                // Write JSON file
                fs.writeFileSync(outputFile, JSON.stringify(subtitles, null, 2), 'utf-8');
                
                console.log(`📁 Saved: ${outputFile} (${subtitles.length} subtitles)`);
                
            } catch (error) {
                console.log(`❌ Error converting ${srtFile}: ${error.message}`);
            }
        } else {
            console.log(`⚠️  File not found: ${srtFile}`);
        }
    }
    
    console.log("=".repeat(60));
    console.log("🎉 Conversion completed!");
    console.log("\n📋 Summary:");
    console.log("- All SRT files converted to JSON format");
    console.log("- Format matches episode 2 structure (en/vi fields)");
    console.log("- Files saved in 'subs/' directory");
    console.log("- Ready for integration with video platform!");
}

main();
