#!/bin/bash

echo "========================================"
echo "  Task Board Application - Quick Start"
echo "========================================"
echo

echo "[1/4] Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing backend dependencies..."
pip install -r requirements.txt

echo
echo "[2/4] Setting up frontend..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
else
    echo "Frontend dependencies already installed"
fi

echo
echo "[3/4] Starting backend server..."
cd ../backend
source venv/bin/activate
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
echo "Backend running (PID: $BACKEND_PID)"

sleep 2

echo
echo "[4/4] Starting frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!
echo "Frontend running (PID: $FRONTEND_PID)"

echo
echo "========================================"
echo "  Setup Complete!"
echo "========================================"
echo
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:5173"
echo "API Docs: http://localhost:8000/docs"
echo
echo "Press Ctrl+C to stop both servers"
echo

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
