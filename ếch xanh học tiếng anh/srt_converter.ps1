# PowerShell Script to Convert SRT to JSON
# Suite Life of Zack and Cody SRT to JSON Converter

function Convert-SrtTime {
    param([string]$TimeString)
    
    $TimeString = $TimeString -replace ',', '.'
    $parts = $TimeString -split ':'
    $hours = [int]$parts[0]
    $minutes = [int]$parts[1]
    $seconds = [double]$parts[2]
    
    return $hours * 3600 + $minutes * 60 + $seconds
}

function Convert-SrtToJson {
    param([string]$SrtFilePath)
    
    Write-Host "Converting $SrtFilePath..."
    
    $content = Get-Content -Path $SrtFilePath -Raw -Encoding UTF8
    $blocks = $content -split '\r?\n\s*\r?\n'
    $subtitles = @()
    
    foreach ($block in $blocks) {
        if (-not $block.Trim()) { continue }
        
        $lines = $block.Trim() -split '\r?\n'
        if ($lines.Count -lt 3) { continue }
        
        $timeLine = $lines[1]
        
        if ($timeLine -match '(\d{2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2},\d{3})') {
            $startTime = Convert-SrtTime $matches[1]
            $endTime = Convert-SrtTime $matches[2]
            
            $text = ($lines[2..($lines.Count-1)] -join ' ')
            $text = $text -replace '<[^>]+>', ''
            $text = $text -replace '\s+', ' '
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
    
    Write-Host "Converted $($subtitles.Count) subtitles from $SrtFilePath"
    return $subtitles
}

Write-Host "Converting Suite Life SRT files to JSON format..."

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
            $outputFile = Join-Path $outputDir "suite-life_$($episode.ToLower())_complete.json"
            $jsonContent = $subtitles | ConvertTo-Json -Depth 3
            $jsonContent | Out-File -FilePath $outputFile -Encoding UTF8
            Write-Host "Saved: $outputFile with $($subtitles.Count) subtitles"
        } catch {
            Write-Host "Error converting $srtFile : $($_.Exception.Message)"
        }
    } else {
        Write-Host "File not found: $srtFile"
    }
}

Write-Host "Conversion completed!"
