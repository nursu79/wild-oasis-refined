import { SunIcon, CloudIcon, BoltIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

async function getWeather(lat, lng) {
  if (!lat || !lng) return null;
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`,
      { next: { revalidate: 3600 } } // Cache weather for 1 hour
    );
    if (!res.ok) throw new Error("Weather service unreachable");
    const data = await res.json();
    return data.current_weather;
  } catch (err) {
    console.error("Weather fetch error:", err);
    return null;
  }
}

function getWeatherIcon(code) {
  if (code === undefined || code === null) return <QuestionMarkCircleIcon className="w-6 h-6 text-primary-400" />;
  if (code <= 1) return <SunIcon className="w-6 h-6 text-yellow-400" />;
  if (code <= 3) return <CloudIcon className="w-6 h-6 text-gray-400" />;
  if (code <= 67) return <CloudIcon className="w-6 h-6 text-blue-400" />; // Rain
  if (code <= 77) return <CloudIcon className="w-6 h-6 text-white" />; // Snow
  if (code <= 99) return <BoltIcon className="w-6 h-6 text-yellow-600" />;
  return <SunIcon className="w-6 h-6 text-yellow-400" />;
}

export default async function WeatherWidget({ lat, lng }) {
  // If coordinates are missing, show a subtle placeholder
  if (!lat || !lng) {
    return (
      <div className="flex items-center gap-3 bg-primary-900/30 px-4 py-2 rounded-full border border-primary-800 italic text-xs text-primary-400">
        <QuestionMarkCircleIcon className="w-4 h-4 animate-pulse" />
        <span>Weather calibration pending...</span>
      </div>
    );
  }

  const weather = await getWeather(lat, lng);

  if (!weather) return (
    <div className="flex items-center gap-3 bg-primary-900/30 px-4 py-2 rounded-full border border-primary-800 italic text-xs text-primary-400">
      <CloudIcon className="w-4 h-4 opacity-50" />
      <span>Weather data unavailable</span>
    </div>
  );

  return (
    <div className="flex items-center gap-4 bg-primary-950/60 px-5 py-2.5 rounded-2xl border border-white/5 backdrop-blur-xl group hover:border-accent-500/30 transition-all shadow-xl">
      <div className="bg-accent-500/10 p-2 rounded-xl border border-accent-500/20 group-hover:bg-accent-500 group-hover:text-primary-950 transition-all duration-500">
        {getWeatherIcon(weather.weathercode)}
      </div>
      <div className="flex flex-col -space-y-0.5">
        <span className="text-white font-serif text-xl leading-none">
          {Math.round(weather.temperature)}°C
        </span>
        <span className="text-[9px] text-primary-400 uppercase font-black tracking-widest opacity-60">
          Live Conditions
        </span>
      </div>
    </div>
  );
}
