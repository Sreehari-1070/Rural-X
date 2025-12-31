# Smart Irrigation Layout Simulator

A farmer-friendly web application to design and visualize sprinkler irrigation systems for agricultural land.

## 🚀 Features

- **Land Dimensions Input**: Easily input length and width of the field.
- **Auto-Calculated Placement**: Automatically determines optimal sprinkler positions based on coverage radius.
- **3D Visualization**: Interactive 3D view of the field with sprinklers and coverage areas.
- **Irrigation Types**: Select between Sprinkler and Drip (Drip coming soon).
- **Client-Side Storage**: Designs are saved automatically so you don't lose progress.

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Engine**: Three.js + React Three Fiber + Drei
- **State Management**: Zustand (with Persistence)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📦 Setup Instructions

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```

3.  **Open Application**
    Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📱 Application Flow

1.  **Landing Page**: Click "Start Designing".
2.  **Select Irrigation**: Choose "Sprinkler Irrigation".
3.  **Enter Details**: Input Land Length, Width, and Sprinkler Radius (e.g., 50m x 20m, 5m radius).
4.  **Visualize**: Interact with the 3D blueprint.
    - **Rotate**: Left Click + Drag
    - **Pan**: Right Click + Drag
    - **Zoom**: Scroll

## 🔧 Project Structure

- `app/`: Next.js pages and layouts
- `components/`: Reusable UI and 3D components
- `store/`: Zustand state management
- `utils/`: Calculation logic
