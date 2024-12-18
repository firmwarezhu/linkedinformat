@echo off
echo Starting LinkedIn Post Formatter...

:: Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: npm is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if node_modules exists, if not run npm install
if not exist node_modules\ (
    echo Installing dependencies...
    npm install
    if %ERRORLEVEL% neq 0 (
        echo Error: Failed to install dependencies!
        pause
        exit /b 1
    )
)

:: Start the development server
echo Starting development server...
start "" http://localhost:5173
npm run dev

:: The script will keep running until you press Ctrl+C
