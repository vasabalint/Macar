@echo off
title Macar - Restaurant Operations & Analytics Platform
echo ========================================================
echo   MACAR - Restaurant Operations & Analytics Platform
echo   Team 11 - ADA University SITE - Fall 2026
echo ========================================================
echo.

cd /d "%~dp0frontend"

:: Ensure node is in PATH if using Windows WinGet LTS
set "PATH=%LOCALAPPDATA%\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.20.0-win-x64;%PATH%"

echo Starting Macar Vite Development Server...
echo Platform URL: http://localhost:5173
echo.

:: Open browser after 2 seconds in background
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:5173"

:: Run the development server
npm.cmd run dev

pause
