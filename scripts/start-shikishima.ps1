# start-shikishima.ps1 — Lv8-C 自動再起動 Watchdog
# 実行: powershell -ExecutionPolicy Bypass -File scripts\start-shikishima.ps1

$BotScript   = "$PSScriptRoot\shikishima-bot.mjs"
$LogFile     = "$PSScriptRoot\..\shikishima-bot.log"
$ErrFile     = "$PSScriptRoot\..\shikishima-bot-err.log"
$MaxRestarts = 20
$RestartCount = 0

Write-Host "しきしまBot Watchdog 起動 (Lv8-C)" -ForegroundColor Cyan
Write-Host "  Bot: $BotScript" -ForegroundColor Gray
Write-Host "  最大再起動: $MaxRestarts 回" -ForegroundColor Gray

while ($RestartCount -lt $MaxRestarts) {
    $StartTime = Get-Date
    $ts = $StartTime.ToString("HH:mm:ss")
    Write-Host "[$ts] 起動 (試行 $($RestartCount + 1)/$MaxRestarts)" -ForegroundColor Green

    # リダイレクト付きで起動
    $proc = Start-Process -FilePath "node" `
        -ArgumentList $BotScript `
        -WorkingDirectory (Split-Path -Parent $PSScriptRoot) `
        -PassThru `
        -NoNewWindow `
        -RedirectStandardOutput $LogFile `
        -RedirectStandardError  $ErrFile

    Write-Host "  PID: $($proc.Id) — 監視中..." -ForegroundColor Gray
    $proc.WaitForExit()

    $ExitCode = $proc.ExitCode
    $Duration = [int]((Get-Date) - $StartTime).TotalSeconds
    $ts2 = (Get-Date).ToString("HH:mm:ss")
    Write-Host "[$ts2] 終了 (code=$ExitCode, 稼働=${Duration}秒)" -ForegroundColor Yellow

    # ExitCode 0 = 正常終了 → 再起動しない
    if ($ExitCode -eq 0) {
        Write-Host "正常終了 — Watchdog 停止" -ForegroundColor Cyan
        break
    }

    $RestartCount++
    if ($RestartCount -ge $MaxRestarts) {
        Write-Host "最大再起動回数超過 — 手動確認が必要です" -ForegroundColor Red
        break
    }

    # 即時クラッシュは長めに待つ
    $cooldown = if ($Duration -lt 30) { 60 } elseif ($Duration -lt 120) { 15 } else { 5 }
    Write-Host "  ${cooldown}秒後に再起動..." -ForegroundColor Yellow
    Start-Sleep -Seconds $cooldown
}

Write-Host "Watchdog 終了。ログ: $LogFile" -ForegroundColor Gray
