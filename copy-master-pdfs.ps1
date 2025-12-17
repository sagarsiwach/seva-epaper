# PowerShell Script to Copy Master PDFs from Edition Root Folders

$sourceBaseDir = "G:\My Drive\000. 2025 Documentation\006. SEVA\001. SA NEWS - GOA - E-PAPER"
$destBaseDir = "C:\Users\Sagar Siwach\Desktop\Development\epaper-viewer\public\editions"

# Create destination if it doesn't exist
if (!(Test-Path $destBaseDir)) {
    New-Item -ItemType Directory -Path $destBaseDir -Force | Out-Null
}

# Get all edition folders
$editions = Get-ChildItem -Path $sourceBaseDir -Directory -Filter "Edition *" | Sort-Object Name

$totalCopied = 0

foreach ($edition in $editions) {
    $editionName = $edition.Name
    $editionPath = $edition.FullName

    # Look for master PDF in root of edition folder
    $pdfFiles = Get-ChildItem -Path $editionPath -Filter "*.pdf" -File -Depth 0

    if ($pdfFiles) {
        $destEditionDir = Join-Path $destBaseDir $editionName

        # Create edition subfolder
        if (!(Test-Path $destEditionDir)) {
            New-Item -ItemType Directory -Path $destEditionDir -Force | Out-Null
        }

        foreach ($pdf in $pdfFiles) {
            $destFile = Join-Path $destEditionDir $pdf.Name
            Write-Host "Copying: $($pdf.Name) ($('{0:N2}' -f ($pdf.Length / 1MB)) MB)" -ForegroundColor Green
            Copy-Item -Path $pdf.FullName -Destination $destFile -Force
            $totalCopied++
        }
    } else {
        Write-Host "No PDF found in root: $editionName" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Copy Complete!" -ForegroundColor Green
Write-Host "Total Master PDFs Copied: $totalCopied" -ForegroundColor Yellow
Write-Host "Destination: $destBaseDir" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
