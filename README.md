# PlantPulse 🌱

PlantPulse is a beautiful, intuitive Internet of Things (IoT) web dashboard designed for a smart plant monitoring and automation system. It allows users to actively track the well-being of their plants through real-time sensors for Temperature, Humidity, Soil Moisture, and surrounding Light (LDR), while also providing remote controls to trigger automated behaviors, such as servos.

## Features ✨
- **Real-Time Telemetry**: Instant visualization of Plant Temperature, Humidity, Soil Moisture, and Light levels.
- **Remote Controls**: Manually adjust triggers or set precise angles for servo mechanisms to handle watering/shading.
- **Preset Management**: Configure and save ideal environmental presets for specific seeds and plants.
- **Admin Dashboard**: Manage users, view comprehensive IoT graphs, and adjust global presets.
- **Beautiful Glassmorphic UI**: Experience a sleek, modern, unified aesthetic across all devices.

## Tech Stack 🛠
- **Frontend Framework**: [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/) for lightning fast builds and optimized production.
- **Styling**: Vanilla CSS with modern Glassmorphism, Bootstrap grid system & Icons.
- **Backend/Database**: Google [Firebase](https://firebase.google.com/) (Realtime Database, Firestore, Authentication).
- **Charting**: Highcharts for powerful user usage and environment graphing trends.

## Getting Started 🚀

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- A Firebase project with Realtime Database and Authentication enabled.

### 2. Installation
Clone the project, then install its dependencies.
```bash
git clone https://github.com/yourusername/PlantPulse.git
cd PlantPulse
npm install
```

### 3. Setup Environment Variables
You will need to set up your Firebase environmental keys. Create a `.env` file in the root of the project with the following structure:
```env
VITE_FIREBASE_API_KEY="YOUR_API_KEY"
VITE_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
VITE_FIREBASE_DATABASE_URL="YOUR_DB_URL"
VITE_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
VITE_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
VITE_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
VITE_FIREBASE_APP_ID="YOUR_APP_ID"
```

### 4. Running the Development Server
```bash
npm start
```

### 5. Building for Production
```bash
npm run build
```

The optimized builds will be output to the `dist` folder.

## Contributing 🤝
Pull requests are totally welcome. If there are major changes you'd like to implement, please open an issue first to discuss what you'd like to change.

## License 📜
Private/Open Source - refer to license.
