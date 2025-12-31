# Rural-X — Smart Farmer Assistance & Government Connected AgriTech Platform

Rural-X is a multilingual, AI-powered AgriTech ecosystem designed to empower farmers, enhance agricultural decision-making, prevent crop loss, ensure fertilizer safety, improve government communication, and build resilient farming communities.

## Key Features

*   **Farmer-Friendly Interface**: Intuitive, bilingual (English/Tamil/Hindi) UI designed for varying literacy levels.
*   **Government Integration**: Direct channels for government alerts, schemes, and data collection.
*   **AI-Powered Diagnostics**: Instant crop disease detection and fertilizer analysis.
*   **Smart Simulation**: Interactive irrigation planning tools.
*   **Resilient Connectivity**: Works with offline support (PWA strategies) and robust error handling.

---

## AI Models & Technology Stack

Rural-X leverages cutting-edge technology to deliver precise agricultural insights:

### 1. Crop Disease Detection System
*   **Model Architecture**: **MobileNetV2** (Transfer Learning)
*   **Framework**: PyTorch
*   **Function**: Analyzes leaf images uploaded by the farmer to detect diseases with high confidence scores.
*   **Backend**: Python (FastAPI)

### 2. Fertilizer Ratio Advisor
*   **Model Architecture**: **Deep Neural Network (DNN)** (3-Layer Perceptron)
*   **Logic**: Analysis of Soil Type, Crop Type, Nitrogen, Phosphorus, Potassium, and Moisture levels.
*   **Function**: Recommends the exact NPK ratio required for optimal yield.
*   **Implementation**: Hybrid (Python training / Node.js Inference via API Routes).

### 3. Polyglot AI Chatbot ("AgriPal")
*   **Technology**: Context-Aware NLP Engine
*   **Languages**: Supports English, Hindi (Devanagari/Transliterated), and Tamil (Script/Transliterated).
*   **Function**: Provides instant answers to farming queries, weather updates, and navigational help.
*   **Features**: Typewriter streaming effect and personalized user context.

### 4. Irrigation Planner
*   **Technology**: Real-time Physics Simulation
*   **Function**: Visualizes water distribution across different field layouts to optimize water usage.

---

## Project Setup & Installation

Follow these steps to set up the RuralX ecosystem on your local machine.

### Prerequisites
*   **Node.js** (v18 or higher)
*   **Python** (3.9 or higher)
*   **Git**

### Folder Structure
Ensure your directories are organized as follows for the automation scripts to work:
```
Desktop/
├── agrisphere-connect-main/    (This Repository - Main Portal)
├── fertilizer-ratio/           (External Tool)
├── irrigation_purpose/         (External Tool)
└── disaster_management/        (External Tool)
```

### 1. Clone the Repository
```bash
git clone https://github.com/ananyaibhan/Rural-X.git
cd Rural-X
```

### 2. Install Main Application Dependencies
```bash
npm install
```

### 3. Setup Python Backend (For Disease Detection)
Navigate to the backend directory and install Python requirements:
```bash
cd python_backend
pip install -r requirements.txt
```

### 4. Setup External Micro-Apps
*Note: These apps currently run on separate ports to simulate a micro-frontend architecture.*

**Fertilizer App (Port 3000):**
```bash
cd ../fertilizer-ratio/fertilizer_app
npm install
```

**Irrigation App (Port 3001):**
```bash
cd ../irrigation_purpose
npm install
```

**Disaster Management (Port 3002):**
```bash
cd ../disaster_management
npm install
```

---

## How to Run

We have provided a unified automation script to launch the entire ecosystem with a single command.

### Option A: Using the Automation Script (Windows)

1.  Open **PowerShell** as Administrator.
2.  Navigate to the project root (`agrisphere-connect-main`).
3.  Run the start script:
    ```powershell
    .\start_services.ps1
    ```
    *This script will automatically verify ports, kill conflicting processes, and launch all 4 applications (Main, Fertilizer, Irrigation, Disaster) simultaneously.*

### Option B: Manual Startup

If you prefer to run services individually, open 4 separate terminal windows:

**Terminal 1 (Main Portal):**
```bash
npm run dev
# Runs on http://localhost:8080
```

**Terminal 2 (Python Backend):**
```bash
cd python_backend
uvicorn main:app --reload --port 8001
# Runs on http://localhost:8001
```

**Terminal 3 (Fertilizer App):**
```bash
cd ../fertilizer-ratio/fertilizer_app
npm run dev
# Runs on http://localhost:3000
```

**Terminal 4 (Irrigation App):**
```bash
cd ../irrigation_purpose
npm run dev -- -p 3001
# Runs on http://localhost:3001
```

---

## Admin & User Access

### Farmer Portal
*   **Login**: Use any mobile number (Self-registration available).
*   **Features**: Disease Detection, Chatbot, Irrigation Tools, Community.

### Admin Portal
*   **Login URL**: `/admin/auth`
*   **Super Admin Credentials**:
    *   **Phone**: `9988776655`
    *   **OTP**: Any 6 digits (Mock Mode)
*   **Authorized Admin**:
    *   **Phone**: `7358372007`
    *   **OTP**: Any 6 digits
*   **Features**: Dashboard Analytics, Farmer Database, Alert Management.

---

## Contributors
1.  Ananya I
2.  Sreehari T.R
3.  Shivashiga A.M
4.  Jayashree M

Blog  -  https://dev.to/shiga2006/rural-x-smart-farmer-assistance-government-connected-agritech-platform-hlo
