@echo off
title Smart Visitor System - Frontend (Port 5173)
echo ========================================================
echo   Starting Smart Visitor Verification System - Frontend
echo ========================================================
cd /d "%~dp0frontend"
npm run dev
pause
