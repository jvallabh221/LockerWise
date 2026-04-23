$ErrorActionPreference = "Stop"

$rootDir = $PSScriptRoot
$frontendDir = Join-Path $rootDir "frontend"
$backendDir = Join-Path $rootDir "backend"

if (-not (Test-Path $frontendDir)) {
    throw "Frontend folder not found at: $frontendDir"
}

if (-not (Test-Path $backendDir)) {
    throw "Backend folder not found at: $backendDir"
}

Write-Host "Starting backend from: $backendDir"
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$backendDir'; npm run dev"
)

Write-Host "Starting frontend from: $frontendDir"
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$frontendDir'; npm run dev"
)

Write-Host "Frontend and backend started in separate PowerShell windows."
