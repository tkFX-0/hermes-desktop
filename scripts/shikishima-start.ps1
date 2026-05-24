# shikishima-start.ps1
$proj    = Split-Path -Parent $PSScriptRoot
$pidFile = Join-Path $proj ".shikishima.pid"
$nodeExe = "C:\Program Files\nodejs\node.exe"

if (-not (Test-Path $nodeExe)) {
    $nodeExe = (Get-Command node -ErrorAction SilentlyContinue).Source
    if (-not $nodeExe) {
        Write-Host "[ERROR] node.exe not found" -ForegroundColor Red
        Start-Sleep 3; exit 1
    }
}

if (Test-Path $pidFile) {
    $oldPid = [int](Get-Content $pidFile -Raw -ErrorAction SilentlyContinue).Trim()
    $proc   = Get-Process -Id $oldPid -ErrorAction SilentlyContinue
    if ($proc -and $proc.Name -eq "node") {
        Write-Host "すでに起動中です (PID: $oldPid)" -ForegroundColor Yellow
        Start-Sleep 2; exit 0
    }
    Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
}

Write-Host "しきしま 起動中..." -ForegroundColor Cyan
$proc = Start-Process -FilePath $nodeExe `
    -ArgumentList "scripts/shikishima-bot.mjs" `
    -WorkingDirectory $proj `
    -PassThru `
    -WindowStyle Hidden

$proc.Id | Set-Content $pidFile -Encoding ASCII
Write-Host "起動完了  PID: $($proc.Id)" -ForegroundColor Green
Start-Sleep 2
