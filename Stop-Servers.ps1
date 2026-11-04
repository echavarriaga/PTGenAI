$projectRoot = $PSScriptRoot
foreach ($name in @('web','rest')) {
 $pidPath = Join-Path $projectRoot "$name.pid"
 if (Test-Path -LiteralPath $pidPath) {
  $taskProcessId = [int](Get-Content -LiteralPath $pidPath)
  $procInfo = Get-CimInstance Win32_Process -Filter "ProcessId=$taskProcessId" -ErrorAction SilentlyContinue
  if ($procInfo -and $procInfo.Name -eq 'node.exe' -and $procInfo.CommandLine -like "*$projectRoot*") {
   Stop-Process -Id $taskProcessId -ErrorAction SilentlyContinue
  }
 }
}
