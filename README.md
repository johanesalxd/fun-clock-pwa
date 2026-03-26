# Kids Time Explorer: Interactive Weather Clock

A beautiful, interactive clock application designed for kids (and adults!) to explore time, weather, and ambient sounds.

## Features

- **Interactive Analog Clock**: Drag the hands to change the time and see the world transform. Includes a "PAUSED" indicator when time is manually adjusted.
- **Digital Clock Controls**: Fully keyboard-accessible buttons to finely adjust hours, minutes, seconds, and toggle AM/PM (without changing the date).
- **Real-time Weather Integration**: Automatically fetches weather based on your location (or defaults to sunny/clear).
- **Dynamic Environments**:
  - **Day/Night Cycle**: The sky changes from bright blue to deep indigo based on the time.
  - **Weather Effects**: Watch it rain, snow, or thunderstorm right on your screen.
  - **Stars**: Twinkling stars appear at night.
- **Immersive Audio**:
  - **Ambient Sounds**: Hear birds singing in the morning, crickets at night, rain on a tin roof, or howling wind in the snow.
  - **Transition Sounds**: A rooster crows at sunrise (6:00 AM) and crickets chirp at sunset (6:00 PM).
  - **Manual Thunder**: Click the thunder button during storms to hear a strike.
- **Soundboard**: A dedicated section in settings to play any of the app's sounds manually.
- **Customizable Display**: Toggle between 12/24 hour time, show/hide seconds, and show/hide the date.
- **Progressive Web App (PWA)**: Installable on mobile and desktop devices with custom maskable icons.
- **Accessible Design (A11Y)**: High-contrast UI elements, comprehensive ARIA labels, screen-reader-friendly toggles, and semantic HTML structure.
- **Smart Orientation Locks**: Prompts users to rotate their devices (portrait for phones, landscape for tablets) for the optimal viewing experience.

## Day, Night, and Weather Scenarios

The app dynamically responds to both the time of day and real-time weather data. Here is how the animations and audio behave:

### 1. Weather Animations (Real-Time)
When you load or refresh the app, it detects your location and fetches the current weather. The animation stays active as long as that weather persists (refresh to update).
- **Clear:** Bright sky (Day) or pulsing stars (Night).
- **Cloudy:** Large, semi-transparent clouds pan across the screen.
- **Rain:** Blue raindrops fall continuously.
- **Thunderstorm:** Raindrops fall, accompanied by full-screen white lightning flashes.
- **Snow:** Soft, white snowflakes drift down the screen.

### 2. Time Travel & Weather Fallback
- Weather data and ambient weather audio (Rain, Snow, Thunderstorm) only play if the clock's date matches *today's real date*.
- **Time Traveled:** If you adjust the date to the past or future, the weather condition is replaced with a "Time traveled" label, and the app defaults to clear weather sounds (Birds for Day, Crickets for Night).

### 3. Background Audio
*Note: Browsers block autoplaying audio. You must open Settings and click "Unmute Sounds" to hear the continuous background tracks.*
- **Clear Weather Audio:** Defaults to **Birds singing** during the Day, and **Crickets chirping** at Night.

### 4. Day/Night Transitions
The app transitions between Day and Night at exactly **6:00 AM** and **6:00 PM (18:00)**.
- **Daytime (6:00 AM - 5:59 PM):** Sky turns light blue.
- **Nighttime (6:00 PM - 5:59 AM):** Sky turns deep indigo and stars appear.
- **Sunrise Sound:** Crossing 6:00 AM triggers a **Rooster crow**.
- **Sunset Sound:** Crossing 6:00 PM triggers **Crickets chirping**.
- **Mute Bypass & Overlap:** These transition sounds play instantly when dragging the clock past 6:00 AM/PM, even if the continuous background sounds are muted. They naturally overlap with the continuous background audio.

### 5. Soundboard
Available in the Settings menu, the soundboard lets you manually trigger any sound in the app.
- **Mute Bypass:** The soundboard operates independently of the background audio mute toggle, allowing you to play sounds even when the background is silent.
- **5-Second Limit:** Every sound triggered from the soundboard plays for exactly 5 seconds and then automatically stops to prevent overlapping noise clutter.

## How to Use

1. **Unmute**: Click the gear icon (Settings) and click "Unmute Sounds" to enable the continuous audio experience.
2. **Explore Time**: Drag the clock hands or use the digital arrow buttons to move through the day.
3. **Sync**: Click the "Sync to Now" button (rotate icon) to return to your current local time and weather.
4. **Soundboard**: Open Settings to find the Soundboard and play with the different environment sounds.

## Technical Details

- Built with **Next.js 15** (App Router) and **Tailwind CSS v4**.
- Animations powered by **Framer Motion** and CSS keyframes.
- Icons from **Lucide React**.
- Weather data provided by **Open-Meteo**.
- Geolocation via **ip-api**.
- Fully responsive, mobile-first design with device-specific orientation locks.

## Deployment

This app is ready to be shared or deployed directly from Google AI Studio.
- Use the **Share** button to create a public link.
- Use the **Deploy** option in the settings menu to host it on Cloud Run.
