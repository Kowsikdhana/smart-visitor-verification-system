@echo off
title Smart Visitor Verification System Launcher
echo ======================================================================
echo           Starting Smart Visitor Verification System
echo ======================================================================
echo [1/2] Launching Backend Spring Boot API (Port 8080)...
start "Visitor Backend (Port 8080)" cmd /k "%~dp0start-backend.bat"

echo [2/2] Launching Frontend React App (Port 5173)...
start "Visitor Frontend (Port 5173)" cmd /k "%~dp0start-frontend.bat"

echo.
echo Both servers are launching!
echo   * Frontend Web UI: http://localhost:5173
echo   * Backend REST API: http://localhost:8080/api
echo   * Default Login: guard / guard123
echo ======================================================================
timeout /t 5
