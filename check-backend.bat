@echo off
echo Checking if backend server is running...
echo.

REM Check if port 5000 is in use
netstat -an | findstr :5000
if %errorlevel% == 0 (
    echo ✅ Port 5000 is in use - Backend may be running
) else (
    echo ❌ Port 5000 is not in use - Backend is NOT running
    echo Please start backend with: cd backend ^&^& npm run dev
    pause
    exit
)

echo.
echo Testing backend endpoints...

REM Test if backend responds
curl -s http://localhost:5000/api/auth/login > nul
if %errorlevel% == 0 (
    echo ✅ Backend is responding
) else (
    echo ❌ Backend is not responding
)

echo.
echo Testing with browser request...
start "" "http://localhost:5000/api/admin/users"

pause
