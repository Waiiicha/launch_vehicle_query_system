@echo off
echo Starting Launch Vehicle Query System...

start "Backend Server" cmd /k "cd server && npm run dev"
start "Frontend Client" cmd /k "cd client && npm run dev"

echo Done. Check the new windows for status.
echo Access the website at: http://localhost:5173
pause