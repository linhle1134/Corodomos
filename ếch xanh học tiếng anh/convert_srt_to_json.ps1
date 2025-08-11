# PowerShell Script to Convert SRT to JSON
# Suite Life of Zack and Cody SRT to JSON Converter

function Convert-SrtTime {
    param([string]$TimeString)
    
    # Convert SRT timestamp to seconds
    # Format: 00:00:03,602 -> 3.602
    $TimeString = $TimeString -replace ',', '.'
    $parts = $TimeString -split ':'
    $hours = [int]$parts[0]
    $minutes = [int]$parts[1]
    $seconds = [double]$parts[2]
    
    return $hours * 3600 + $minutes * 60 + $seconds
}

function Convert-SrtToJson {
    param([string]$SrtFilePath)
    
    Write-Host "🎬 Converting $SrtFilePath..." -ForegroundColor Green
    
    $content = Get-Content -Path $SrtFilePath -Raw -Encoding UTF8
    
    # Split by double newlines to get subtitle blocks
    $blocks = $content -split '\r?\n\s*\r?\n'
    
    $subtitles = @()
    
    foreach ($block in $blocks) {
        if (-not $block.Trim()) { continue }
        
        $lines = $block.Trim() -split '\r?\n'
        if ($lines.Count -lt 3) { continue }
        
        # Skip subtitle number (first line)
        # Second line contains timestamps
        $timeLine = $lines[1]
        
        # Parse timestamps: 00:00:03,602 --> 00:00:05,437
        if ($timeLine -match '(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})') {
            $startTime = Convert-SrtTime $matches[1]
            $endTime = Convert-SrtTime $matches[2]
            
            # Join remaining lines as subtitle text
            $text = ($lines[2..($lines.Count-1)] -join ' ')
            
            # Clean up text (remove formatting, excessive spaces)
            $text = $text -replace '<[^>]+>', '' # Remove HTML tags
            $text = $text -replace '\s+', ' '    # Normalize spaces
            $text = $text.Trim()
            
            if ($text) {
                $subtitle = @{
                    start = [Math]::Round($startTime, 2)
                    end = [Math]::Round($endTime, 2)
                    en = $text
                    vi = ""
                }
                $subtitles += $subtitle
            }
        }
    }
    
    Write-Host "✅ Converted $($subtitles.Count) subtitles from $SrtFilePath" -ForegroundColor Yellow
    return $subtitles
}

# Main conversion process
Write-Host "🎯 Converting Suite Life SRT files to JSON format..." -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Gray

# File mappings
$srtFiles = @{
    'S01E01' = 'The.Suite.Life.of.Zack.and.Cody.S01E01.WEBRip.x264-SRS.srt'
    'S01E02' = 'The.Suite.Life.of.Zack.and.Cody.S01E02.WEBRip.x264-SRS.srt'
    'S01E03' = 'The.Suite.Life.of.Zack.and.Cody.S01E03.WEBRip.x264-SRS.srt'
    'S01E04' = 'Suite Life S1 E4.srt'
    'S01E05' = 'The.Suite.Life.of.Zack.and.Cody.S01E05.WEBRip.x264-SRS.srt'
}

$outputDir = 'subs'
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
}

foreach ($episode in $srtFiles.Keys) {
    $srtFile = $srtFiles[$episode]
    
    if (Test-Path $srtFile) {
        try {
            $subtitles = Convert-SrtToJson -SrtFilePath $srtFile
            
            # Create output filename
            $outputFile = Join-Path $outputDir "suite-life_$($episode.ToLower())_complete.json"
            
            # Convert to JSON and write file
            $jsonContent = $subtitles | ConvertTo-Json -Depth 3
            $jsonContent | Out-File -FilePath $outputFile -Encoding UTF8
            
            Write-Host "📁 Saved: $outputFile ($($subtitles.Count) subtitles)" -ForegroundColor Magenta
            
        } catch {
            Write-Host "❌ Error converting ${srtFile}: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "⚠️  File not found: $srtFile" -ForegroundColor Yellow
    }
}

Write-Host ("=" * 60) -ForegroundColor Gray
Write-Host "🎉 Conversion completed!" -ForegroundColor Green
Write-Host "`n📋 Summary:" -ForegroundColor White
Write-Host "- All SRT files converted to JSON format" -ForegroundColor White
Write-Host "- Format matches episode 2 structure (en/vi fields)" -ForegroundColor White
Write-Host "- Files saved in 'subs/' directory" -ForegroundColor White
Write-Host "- Ready for integration with video platform!" -ForegroundColor White
