import { useState, useEffect } from 'react';

interface WeatherData {
  temperature: number;
  weathercode: number;
  windspeed: number;
  is_day: number;
}

/** Fetches weather data and timezone based on user's geolocation. */
export function useWeather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherCondition, setWeatherCondition] = useState<string>('clear');
  const [locationName, setLocationName] = useState<string>('Local');
  const [sunrise, setSunrise] = useState<string | null>(null);
  const [sunset, setSunset] = useState<string | null>(null);
  const [timezone, setTimezone] = useState<string>(() => {
    if (typeof Intl !== 'undefined') {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }
    return 'UTC';
  });

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=sunrise,sunset&timezone=auto`);
          const data = await res.json();
          setWeatherData(data.current_weather);
          if (data.timezone) {
            setTimezone(data.timezone);
          }
          if (data.daily && data.daily.sunrise && data.daily.sunset) {
            setSunrise(data.daily.sunrise[0]);
            setSunset(data.daily.sunset[0]);
          }
          
          // Try to get city/country name using reverse geocoding
          try {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10`);
            const geoData = await geoRes.json();
            if (geoData && geoData.address) {
              const city = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.county;
              const country = geoData.address.country_code ? geoData.address.country_code.toUpperCase() : '';
              if (city && country) {
                setLocationName(`${city}, ${country}`);
              } else if (city) {
                setLocationName(city);
              } else if (data.timezone) {
                setLocationName(data.timezone.split('/').pop().replace('_', ' '));
              }
            }
          } catch (geoError) {
            console.warn("Reverse geocoding failed, falling back to timezone name", geoError);
            if (data.timezone) {
              setLocationName(data.timezone.split('/').pop().replace('_', ' '));
            }
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

  return { weatherData, weatherCondition, locationName, timezone, sunrise, sunset };
}
