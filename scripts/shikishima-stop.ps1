# shikishima-stop.ps1
$proj    = Split-Path -Parent $PSScriptRoot
$pidFile = Join-Path $proj ".shikishima.pid"
$stopped = $false

if (Test-Path $pidFile) {
    $savedPid = [int](Get-Content $pidFile -Raw -ErrorAction SilentlyContinue).Trim()
    $proc = Get-Process -Id $savedPid -ErrorAction SilentlyContinue
    if ($proc) {
        Write-Host "しきしま 停止中 (PID: $savedPid)..." -ForegroundColor Yellow
        Stop-Process -Id $savedPid -Force -ErrorAction SilentlyContinue
        Write-Host "停止完了" -ForegroundColor Green
        $stopped = $true
    }
    Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
}

if (-not $stopped) {
    Write-Host "プロセスを検索中..." -ForegroundColor Cyan
    $procs = Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
             Where-Object { $_.CommandLine -like "*shikishima-bot*" }
    if ($procs) {
        foreach ($p in $procs) {
            Write-Host "停止: PID $($p.ProcessId)" -ForegroundColor Yellow
            Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue
        }
        Write-Host "停止完了" -ForegroundColor Green
    } else {
        Write-Host "起動していません" -ForegroundColor Gray
    }
}
Start-Sleep 2
