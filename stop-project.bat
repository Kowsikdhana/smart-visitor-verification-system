@echo off
title Stop Smart Visitor Verification System
echo Stopping any running processes on port 8080 and port 5173...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080" ^| findstr "LISTENING"') do (
    echo Stopping backend process (PID: %%a)...
    taskkill /f /pid %%a
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo Stopping frontend process (PID: %%a)...
    taskkill /f /pid %%a
)
echo All services stopped.
pause
