# Creates responsive JPEG versions of the photographs in assets/ (originals are kept).
# Usage (Windows PowerShell):  powershell -ExecutionPolicy Bypass -File scripts/optimise-images.ps1
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$src = Join-Path $root "assets"
$out = Join-Path $src "img"
New-Item -ItemType Directory -Force $out | Out-Null
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$params = New-Object System.Drawing.Imaging.EncoderParameters 1
$params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), 78L
foreach ($file in Get-ChildItem (Join-Path $src "pexels-*.jpg")) {
  $img = [System.Drawing.Image]::FromFile($file.FullName)
  foreach ($w in 640, 1280) {
    $width = [Math]::Min($w, $img.Width)
    $height = [int][Math]::Round($img.Height * $width / $img.Width)
    $bmp = New-Object System.Drawing.Bitmap $width, $height
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, $width, $height)
    $target = Join-Path $out ("{0}-{1}.jpg" -f $file.BaseName, $w)
    $bmp.Save($target, $codec, $params)
    $g.Dispose(); $bmp.Dispose()
  }
  $img.Dispose()
}
Get-ChildItem $out | Select-Object Name, Length
