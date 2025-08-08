@echo off
setlocal enabledelayedexpansion
REM Get the current date and time in ISO 8601 format using PowerShell
for /f "delims=" %%i in ('powershell -Command "Get-Date -Format o"') do set ISODATE=%%i
REM Write the buildinfo.js file
(
  echo // Auto-generated at build time
  echo export const BUILD_DATE = "!ISODATE!";
) > src\utils\buildinfo.js

echo Build timestamp written to src\utils\buildinfo.js
endlocal

