# Time Explorer: Interactive Weather Clock

A beautiful, interactive clock application designed for kids (and adults!) to explore time, weather, and ambient sounds.

## Features

- **Interactive Analog Clock**: Drag the hands to change the time and see the world transform.
- **Real-time Weather Integration**: Automatically fetches weather based on your location (or defaults to sunny/clear).
- **Dynamic Environments**:
  - **Day/Night Cycle**: The sky changes from bright blue to deep indigo based on the time.
  - **Weather Effects**: Watch it rain, snow, or thunderstorm right on your screen.
  - **Stars**: Twinkling stars appear at night.
- **Immersive Audio**:
  - **Ambient Sounds**: Hear birds singing in the morning, crickets at night, rain on a tin roof, or howling wind in the snow.
  - **Rooster Wake-up**: A rooster crows when you transition from night to morning (6:00 AM).
  - **Manual Thunder**: Click the thunder button during storms to hear a strike.
- **Soundboard**: A dedicated section in settings to play any of the app's sounds manually.
- **Customizable Display**: Toggle between 12/24 hour time, show/hide seconds, and show/hide the date.

## How to Use

1. **Unmute**: Click the gear icon (Settings) and click "Unmute Sounds" to enable the audio experience.
2. **Explore Time**: Drag the clock hands or use the arrow buttons to move through the day.
3. **Sync**: Click the "Sync to Now" button to return to your current local time and weather.
4. **Soundboard**: Open Settings to find the Soundboard and play with the different environment sounds.

## Technical Details

- Built with **Next.js** and **Tailwind CSS**.
- Animations powered by **Framer Motion**.
- Icons from **Lucide React**.
- Weather data provided by **Open-Meteo**.
- Geolocation via **ip-api**.

## Deployment

This app is ready to be shared or deployed directly from Google AI Studio.
- Use the **Share** button to create a public link.
- Use the **Deploy** option in the settings menu to host it on Cloud Run.
