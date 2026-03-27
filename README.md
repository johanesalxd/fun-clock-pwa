# Kids Time Explorer

Kids Time Explorer is an interactive, educational web application designed to help children learn about time, weather, and the day/night cycle in a fun and engaging way.

## Features

- **Interactive Clock:** Drag the hands or use the buttons to time travel! The app features both an analog and a digital clock.
- **Timer Mode:** Switch to Timer Mode to set a countdown and hear an alarm when time is up. The timer has simplified settings, always showing seconds and hiding irrelevant clock options.
- **Real Weather Integration:** Uses your location to show the current weather outside (rain, snow, clear, cloudy, etc.) using the Open-Meteo API.
- **Day & Night Cycle:** Watch the sky change colors and stars appear automatically as day turns to night.
- **Nature Sounds & Soundboard:** Hear ambient sounds like birds, crickets, rain, and thunder. Open the settings to play fun sounds anytime!
- **Responsive Design:** Optimized for both mobile and tablet devices.

## How to Play

- Click the Gear icon ⚙️ and select "Unmute Sounds" to hear the background audio.
- Move the clock hands to explore different times and see the sky change.
- Click the Rotate icon 🔄 to return to the real time or reset your timer.
- Open Settings to play fun sounds anytime using the soundboard.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Weather API:** Open-Meteo

## Architecture & Modularity

The application is built with a focus on modularity and separation of concerns:

- **Custom Hooks:** Core logic is extracted into custom hooks (`useClock`, `useTimer`, `useWeather`) to manage state and side effects cleanly.
- **UI Components:** The user interface is composed of reusable components (`AnalogClock`, `DigitalClock`, `WeatherOverlay`, `SettingsOverlay`, `HelpOverlay`, etc.) to keep the main page component focused on layout and composition.

## Getting Started

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Start the development server using `npm run dev`.
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## License

MIT
