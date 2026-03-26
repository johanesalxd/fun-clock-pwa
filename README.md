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

## Day, Night, and Weather Scenarios

The app dynamically responds to both the time of day and real-time weather data. Here is how the animations and audio behave:

### 1. Weather Animations (Real-Time)
When you load or refresh the app, it detects your location and fetches the current weather. The animation stays active as long as that weather persists (refresh to update).
- **Clear:** Bright sky (Day) or pulsing stars (Night).
- **Cloudy:** Large, semi-transparent clouds pan across the screen.
- **Rain:** Blue raindrops fall continuously.
- **Thunderstorm:** Raindrops fall, accompanied by full-screen white lightning flashes.
- **Snow:** Soft, white snowflakes drift down the screen.

### 2. Background Audio
*Note: Browsers block autoplaying audio. You must open Settings and click "Unmute Sounds" to hear the background tracks.*
- **Weather Audio:** If it is currently raining, snowing, or thundering, the app plays the corresponding ambient sound (Rain, Snow, Thunderstorm).
- **Time Travel Rule:** Weather audio only plays if the clock's date matches *today's real date*. If you drag the clock to a past or future date, the app defaults to clear weather sounds.
- **Clear Weather Audio:** Defaults to **Birds singing** during the Day, and **Crickets chirping** at Night.

### 3. Day/Night Transitions
The app transitions between Day and Night at exactly **6:00 AM** and **6:00 PM (18:00)**.
- **Daytime (6:00 AM - 5:59 PM):** Sky turns light blue.
- **Nighttime (6:00 PM - 5:59 AM):** Sky turns deep indigo and stars appear.
- **Sunrise Sound:** Crossing 6:00 AM triggers a **Rooster crow** for 5 seconds.
- **Sunset Sound:** Crossing 6:00 PM triggers **Crickets chirping** for 5 seconds.

### 4. Soundboard
Available in the Settings menu, the soundboard lets you manually trigger any sound in the app.
- **5-Second Limit:** Every sound triggered from the soundboard plays for exactly 5 seconds and then automatically stops to prevent overlapping noise clutter.

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
