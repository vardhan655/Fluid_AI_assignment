@echo off
echo ========================================
echo   Task Board Application - Quick Start
echo ========================================
echo.

echo [1/4] Setting up backend...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing backend dependencies...
pip install -r requirements.txt

echo.
echo [2/4] Setting up frontend...
cd ..\frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo Frontend dependencies already installed
)

echo.
echo [3/4] Starting backend server...
cd ..\backend
start "Task Board Backend" cmd /k "venv\Scripts\activate.bat && uvicorn main:app --reload --port 8000"

timeout /t 3 /nobreak > nul

echo.
echo [4/4] Starting frontend server...
cd ..\frontend
start "Task Board Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo API Docs: http://localhost:8000/docs
echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
echo.
pause
