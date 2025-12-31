$basePath = "C:\Users\TR Sreehari\Desktop"

Write-Host "Starting Agrisphere Services..." -ForegroundColor Green

# 1. Start Main App (Agrisphere Connect) - Port 8080
Write-Host "Starting Main App..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$basePath\agrisphere-connect-main'; npm run dev"

# 2. Start Fertilizer App - Port 3000
Write-Host "Starting Fertilizer App..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$basePath\fertilizer-ratio\fertilizer_app'; npm run dev"

# 3. Start Irrigation App - Port 3001
Write-Host "Starting Irrigation App..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$basePath\irrigation_purpose'; npm run dev -- -p 3001"

# 4. Start Disaster Management App - Port 3002 (frontend) + 8000 (backend)
Write-Host "Starting Disaster Management App..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$basePath\disaster_management'; npx concurrently 'next dev -p 3002' 'uvicorn backend.main:app --reload --port 8000'"

# 5. Start Crop Disease Backend - Port 8001
Write-Host "Starting Crop Disease Backend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$basePath\agrisphere-connect-main\python_backend'; uvicorn main:app --reload --port 8001"

Write-Host "All services started!" -ForegroundColor Green
Write-Host "Main App: http://localhost:8080"
Write-Host "Fertilizer: http://localhost:3000"
Write-Host "Irrigation: http://localhost:3001"
Write-Host "Disaster: http://localhost:3002"
Write-Host "Disease API: http://localhost:8001"
