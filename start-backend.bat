@echo off
title Smart Visitor System - Backend (Port 8080)
echo ========================================================
echo   Starting Smart Visitor Verification System - Backend
echo ========================================================
set "JAVA_HOME=C:\Program Files\Java\jdk-25"
set "PATH=%JAVA_HOME%\bin;C:\Program Files\JetBrains\IntelliJ IDEA 2025.3.1\plugins\maven\lib\maven3\bin;%PATH%"
cd /d "%~dp0backend"
"C:\Program Files\JetBrains\IntelliJ IDEA 2025.3.1\plugins\maven\lib\maven3\bin\mvn.cmd" spring-boot:run
pause
