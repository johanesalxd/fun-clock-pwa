# Kids Time Explorer

Kids Time Explorer is an interactive, educational web application designed to help children learn about time, weather, and the day/night cycle in a fun and engaging way.

## Features

- **Interactive Clock:** Drag the hands or use the buttons to time travel! The app features both an analog and a digital clock.
- **Speak Time:** Tap the speaker icon to hear the current time spoken aloud! Supports General English, British English, and Bahasa Indonesia.
- **Timer Mode:** Switch to Timer Mode to set a countdown (up to 24 hours) and hear an alarm when time is up. Falls back to a Web Audio API oscillator and device vibration if the audio element is blocked by the platform.
- **Real Weather & Location:** Uses your location to show the current weather outside (rain, snow, clear, cloudy, etc.) using the Open-Meteo API, and displays your city and country using Nominatim reverse geocoding.
- **Day & Night Cycle:** Watch the sky change colors and stars appear automatically as day turns to night.
- **Nature Sounds & Soundboard:** Hear ambient sounds like birds, crickets, rain, and thunder. Open the settings to play fun sounds anytime!
- **Responsive Design:** Works on desktop, tablet, and mobile with orientation-aware layouts. Phone landscape and tablet portrait show rotate-to-correct-orientation overlays.
- **PWA:** Fully installable as a Progressive Web App with custom icons, service worker, safe-area insets, and theme-color sync for a native-feel experience on iOS and Android.
- **Accessibility:** Lighthouse Accessibility 100/100. WCAG AA contrast compliant in both day and night modes. Full screen reader support — all controls labeled, toggle switches use `role="switch"`, and the page has a visually hidden `h1`.

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
- **APIs:** Open-Meteo (Weather), Nominatim (Reverse Geocoding), Web Speech API (Text-to-Speech)

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
