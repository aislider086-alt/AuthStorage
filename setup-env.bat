@echo off
echo Setting up AuthStorage environment...
echo.
echo Please follow these steps:
echo 1. Go to https://neon.tech/ and create a free account
echo 2. Create a new project
echo 3. Copy your database connection string
echo 4. Replace the DATABASE_URL in .env file
echo.
echo Current .env file location: %cd%\.env
echo.
echo After updating DATABASE_URL, run: npm run db:push
echo Then run: .\start.bat
echo.
pause
