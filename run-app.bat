@echo off
title PurpleZone MERN App Launcher
echo ==================================================
echo    PurpleZone Grammar Checker - MERN App Launcher
echo ==================================================
echo.

echo [1/3] Starting backend server in a new window...
start "PurpleZone Backend Server" cmd /k "cd backend && npm run dev"

echo [2/3] Starting frontend dev server in a new window...
start "PurpleZone Frontend Server" cmd /k "cd frontend && npm run dev"

echo [3/3] Opening application in your browser...
timeout /t 2 >nul
start http://localhost:5173

echo.
echo ==================================================
echo  Both servers are starting up in separate consoles.
echo  - Frontend: http://localhost:5173
echo  - Backend API: http://localhost:5000
echo ==================================================
echo.
echo  Keep the terminal windows open while testing!
echo  Press any key to close this launcher console...
pause >nul
