# PowerShell Script to Copy Edition JPGs to App

$sourceBaseDir = "G:\My Drive\000. 2025 Documentation\006. SEVA\001. SA NEWS - GOA - E-PAPER"
$destBaseDir = "C:\Users\Sagar Siwach\Desktop\Development\epaper-viewer\public\editions"

# Create destination if it doesn't exist
if (!(Test-Path $destBaseDir)) {
    New-Item -ItemType Directory -Path $destBaseDir -Force | Out-Null
}

# Get all edition folders
$editions = Get-ChildItem -Path $sourceBaseDir -Directory -Filter "Edition *" | Sort-Object Name

$totalCopied = 0
$totalEditions = 0

foreach ($edition in $editions) {
    $editionName = $edition.Name
    $jpgPath = Join-Path $edition.FullName "PAPER\JPG"

    if (Test-Path $jpgPath) {
        $destEditionDir = Join-Path $destBaseDir $editionName

        # Create edition subfolder
        if (!(Test-Path $destEditionDir)) {
            New-Item -ItemType Directory -Path $destEditionDir -Force | Out-Null
        }

        # Copy JPG files only
        $jpgFiles = Get-ChildItem -Path $jpgPath -Filter "*.jpg" -File

        if ($jpgFiles) {
            $totalEditions++
            Write-Host "Copying $($jpgFiles.Count) files from $editionName..." -ForegroundColor Green

            foreach ($file in $jpgFiles) {
                Copy-Item -Path $file.FullName -Destination $destEditionDir -Force
                $totalCopied++
            }
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Copy Complete!" -ForegroundColor Green
Write-Host "Editions Processed: $totalEditions" -ForegroundColor Yellow
Write-Host "Total Files Copied: $totalCopied" -ForegroundColor Yellow
Write-Host "Destination: $destBaseDir" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
