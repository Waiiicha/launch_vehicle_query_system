@echo off
echo Starting Launch Vehicle System (Static Mode)...

start "Frontend Client" cmd /k "cd client && npm run dev"

echo.
echo ==========================================
echo  System Started in Static Mode.
echo  Access at: http://localhost:5173
echo ==========================================
pause