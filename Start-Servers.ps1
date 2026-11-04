$ErrorActionPreference = 'Stop'
$projectRoot = $PSScriptRoot
$nodeExe = (Get-Command node.exe -ErrorAction Stop).Source
foreach ($entry in @(@{Port=8090;Script='server.js';Name='web'}, @{Port=3000;Script='rest2/server.js';Name='rest'})) {
 $listener = Get-NetTCPConnection -State Listen -LocalPort $entry.Port -ErrorAction SilentlyContinue
 if ($listener) { throw "El puerto $($entry.Port) ya está ocupado. No se ha detenido ningún proceso." }
 $scriptPath = Join-Path $projectRoot $entry.Script
 $process = Start-Process -FilePath $nodeExe -ArgumentList @($scriptPath) -WorkingDirectory $projectRoot -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $projectRoot "$($entry.Name).stdout.log") -RedirectStandardError (Join-Path $projectRoot "$($entry.Name).stderr.log")
 $process.Id | Set-Content -LiteralPath (Join-Path $projectRoot "$($entry.Name).pid")
}
Write-Output 'PTGenAI: http://localhost:8090/PTGenAI.html'
