import { useState, useEffect } from 'react';

export function useWeather() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherCondition, setWeatherCondition] = useState<string>('clear');
  const [locationName, setLocationName] = useState<string>('Local');
  const [timezone, setTimezone] = useState<string>('UTC');

  useEffect(() => {
    const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setTimezone(localTz);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`);
          const data = await res.json();
          setWeatherData(data.current_weather);
          if (data.timezone) {
            setTimezone(data.timezone);
            setLocationName(data.timezone.split('/').pop().replace('_', ' '));
          }
          
          const code = data.current_weather.weathercode;
          let condition = 'clear';
          if (code >= 1 && code <= 3) condition = 'cloudy';
          if ((code >= 51 && code <= 65) || (code >= 80 && code <= 82)) condition = 'rain';
          if (code >= 71 && code <= 77) condition = 'snow';
          if (code >= 95 && code <= 99) condition = 'thunderstorm';
          setWeatherCondition(condition);
          
        } catch (e) {
          console.error("Failed to fetch weather", e);
        }
      }, (error) => {
        console.warn("Geolocation not available or denied. Using default location.");
      });
    }
  }, []);

  return { weatherData, weatherCondition, locationName, timezone };
}
