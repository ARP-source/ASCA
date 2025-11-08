@echo off
echo ========================================
echo ASCA Multi-Agent System Demo
echo ========================================
echo.
echo Starting backend API server...
echo Backend will run on http://localhost:8080
echo.
start cmd /k "cd backend && python main.py"
timeout /t 3
echo.
echo Starting frontend server...
echo Frontend will run on http://localhost:8000
echo.
start cmd /k "python -m http.server 8000"
timeout /t 2
echo.
echo ========================================
echo Opening browser...
echo ========================================
start http://localhost:8000
echo.
echo Both servers are running!
echo - Backend API: http://localhost:8080/docs
echo - Frontend UI: http://localhost:8000
echo.
echo Press any key to stop servers...
pause
