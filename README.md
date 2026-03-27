# Kids Time Explorer: Interactive Weather Clock

A beautiful, interactive clock application designed for kids (and adults!) to explore time, weather, and ambient sounds.

## Features

- **Interactive Analog Clock**: Drag the hands independently (hours, minutes, seconds) to change the time and see the world transform. The second hand ticks exactly on the second like a quartz watch. Includes a "PAUSED" indicator when time is manually adjusted.
- **Digital Clock Controls**: Fully keyboard-accessible buttons to finely adjust hours, minutes, seconds, and toggle AM/PM. Color-coded for clarity (Green: Hours, Red: Minutes, Blue: Seconds) with a helpful legend.
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
- **Customizable Display**: Toggle between 12/24 hour time, show/hide seconds, show/hide the date, enable Alternate Mode (00-60), and toggle the Full Seconds Circle (1-60). Settings toggles are color-coded to match the clock hands.
- **Progressive Web App (PWA)**: Installable on mobile and desktop devices with custom maskable icons. Fully supports "Add to Home Screen" on iOS/iPadOS via Safari or Chrome.
- **Accessible Design (A11Y)**: High-contrast UI elements, comprehensive ARIA labels, screen-reader-friendly toggles, and semantic HTML structure.
- **Smart Orientation Locks**: Prompts users to rotate their devices (portrait for phones, landscape for tablets) for the optimal viewing experience.
- **In-App Help Guide**: A dedicated "How to Play" modal explaining features, controls, and installation tips.

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
5. **Help**: Click the `?` icon at the top right to view the in-app guide and installation instructions.

## Technical Details

- Built with **Next.js 15** (App Router) and **Tailwind CSS v4**.
- Animations powered by **Framer Motion** and CSS keyframes.
- Icons from **Lucide React**.
- Weather data provided by **Open-Meteo**.
- Geolocation via **ip-api**.
- Fully responsive, mobile-first design with device-specific orientation locks.

## Testing & Quality Assurance (QA)

This application has undergone a rigorous, 5-round automated QA process driven by AI agents using headless Playwright and Chrome DevTools Protocol (CDP). 

**Key Highlights:**
- **Accessibility & Performance:** Achieved a perfect **100/100 Lighthouse Accessibility score**, alongside excellent scores in SEO and Best Practices.
- **Cross-Device Compatibility:** Fully tested across Desktop, Mobile (Portrait & Landscape), and Tablet viewports, including specific orientation locks for different device types.
- **Advanced Emulation:** Verified complex edge cases using advanced CDP techniques:
  - **Geolocation Overrides:** Tested weather fetching for different global coordinates (e.g., San Francisco, Tokyo).
  - **Fetch Interception:** Mocked API responses to verify rare UI states (e.g., Thunderstorm conditions).
  - **Audio Pipeline Verification:** Programmatically verified background audio and transition sounds (rooster/cricket) without relying on audible output.
- **Zero Open Bugs:** All identified functional, UI/UX, and accessibility issues have been successfully resolved.

For a comprehensive breakdown of the methodology, test matrices, and resolved issues, please refer to the full [QA Report](QA_REPORT.md).

## Deployment

This app is ready to be shared or deployed directly from Google AI Studio.
- Use the **Share** button to create a public link.
- Use the **Deploy** option in the settings menu to host it on Cloud Run.
