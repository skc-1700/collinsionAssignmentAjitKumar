// Open-Meteo Geocoding API
export interface GeoResult {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

export async function searchCities(query: string): Promise<GeoResult[]> {
  if (query.length < 2) return [];
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
  );
  const data = await res.json();
  return (data.results || []).map((r: any) => ({
    id: r.id,
    name: r.name,
    country: r.country,
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

// Open-Meteo Forecast API
interface DailyForecast {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  windSpeed: number;
  precipitation: number;
}

export interface ActivityRanking {
  date: string;
  activity: string;
  rank: number;
  reasoning: string;
}

const ACTIVITIES = ["Skiing", "Surfing", "Outdoor Sightseeing", "Indoor Sightseeing"];

function weatherCodeDescription(code: number): string {
  const map: Record<number, string> = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Depositing rime fog",
    51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
    61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
    71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
    77: "Snow grains", 80: "Slight rain showers", 81: "Moderate rain showers",
    82: "Violent rain showers", 85: "Slight snow showers", 86: "Heavy snow showers",
    95: "Thunderstorm", 96: "Thunderstorm with slight hail", 99: "Thunderstorm with heavy hail",
  };
  return map[code] || "Unknown";
}

function clampRank(v: number): number {
  return Math.max(1, Math.min(10, Math.round(v)));
}

function rankActivities(day: DailyForecast): ActivityRanking[] {
  const { date, weatherCode, tempMax, tempMin, windSpeed, precipitation } = day;
  const desc = weatherCodeDescription(weatherCode);
  const avgTemp = (tempMax + tempMin) / 2;
  const isSnowy = [71, 73, 75, 77, 85, 86].includes(weatherCode);
  const isRainy = [61, 63, 65, 80, 81, 82].includes(weatherCode);
  const isClear = [0, 1, 2].includes(weatherCode);
  const isStormy = [95, 96, 99].includes(weatherCode);

  const rankings: ActivityRanking[] = [];

  // Skiing
  let skiRank = 5;
  if (isSnowy) skiRank += 3;
  if (tempMax < 0) skiRank += 2;
  else if (tempMax < 5) skiRank += 1;
  if (tempMax > 15) skiRank -= 3;
  if (windSpeed > 40) skiRank -= 2;
  rankings.push({ date, activity: "Skiing", rank: clampRank(skiRank), reasoning: `${desc} & ${tempMax}°C, wind ${windSpeed} km/h` });

  // Surfing
  let surfRank = 5;
  if (windSpeed > 15 && windSpeed < 35) surfRank += 2;
  if (isClear) surfRank += 1;
  if (avgTemp > 20) surfRank += 1;
  if (isStormy) surfRank -= 3;
  if (tempMax < 10) surfRank -= 2;
  rankings.push({ date, activity: "Surfing", rank: clampRank(surfRank), reasoning: `${desc} & ${tempMax}°C, wind ${windSpeed} km/h` });

  // Outdoor Sightseeing
  let outRank = 5;
  if (isClear) outRank += 3;
  if (avgTemp >= 18 && avgTemp <= 28) outRank += 2;
  if (isRainy || isStormy) outRank -= 3;
  if (precipitation > 5) outRank -= 1;
  rankings.push({ date, activity: "Outdoor Sightseeing", rank: clampRank(outRank), reasoning: `${desc} & ${avgTemp.toFixed(0)}°C avg` });

  // Indoor Sightseeing
  let inRank = 5;
  if (isRainy || isStormy) inRank += 3;
  if (isClear && avgTemp > 20) inRank -= 2;
  if (precipitation > 10) inRank += 1;
  rankings.push({ date, activity: "Indoor Sightseeing", rank: clampRank(inRank), reasoning: `${desc} & ${precipitation}mm precip` });

  return rankings;
}

export async function getActivityRankings(lat: number, lon: number): Promise<ActivityRanking[]> {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,wind_speed_10m_max,precipitation_sum&timezone=auto&forecast_days=7`
  );
  const data = await res.json();
  const days: DailyForecast[] = data.daily.time.map((t: string, i: number) => ({
    date: t,
    weatherCode: data.daily.weather_code[i],
    tempMax: data.daily.temperature_2m_max[i],
    tempMin: data.daily.temperature_2m_min[i],
    windSpeed: data.daily.wind_speed_10m_max[i],
    precipitation: data.daily.precipitation_sum[i],
  }));
  return days.flatMap(rankActivities);
}
