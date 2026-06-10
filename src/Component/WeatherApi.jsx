import { useState } from "react";

const API_KEY = import.meta.env.VITE_API_KEY;

const weatherBackgrounds = {
  Clear: "linear-gradient(135deg, #1a6bb5 0%, #4db6e6 100%)",
  Clouds: "linear-gradient(135deg, #5f6b7a 0%, #9baab8 100%)",
  Rain: "linear-gradient(135deg, #2c3e50 0%, #4a6274 100%)",
  Drizzle: "linear-gradient(135deg, #3d5a6e 0%, #6a92a8 100%)",
  Thunderstorm: "linear-gradient(135deg, #1a1a2e 0%, #3a3a5c 100%)",
  Snow: "linear-gradient(135deg, #7f9fbb 0%, #c5d8e8 100%)",
  Mist: "linear-gradient(135deg, #6b7a88 0%, #a8b8c8 100%)",
  Fog: "linear-gradient(135deg, #6b7a88 0%, #a8b8c8 100%)",
  default: "linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%)",
};

const weatherIcons = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Drizzle: "🌦️",
  Thunderstorm: "⛈️",
  Snow: "❄️",
  Mist: "🌫️",
  Fog: "🌫️",
  default: "🌡️",
};

function getTime(timezoneOffset) {
  const utc = Date.now() + new Date().getTimezoneOffset() * 60000;
  const local = new Date(utc + timezoneOffset * 1000);
  return local.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function getDay(timezoneOffset) {
  const utc = Date.now() + new Date().getTimezoneOffset() * 60000;
  const local = new Date(utc + timezoneOffset * 1000);
  return local.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
}

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const search = async (e) => {
    e.preventDefault();
    const q = city.trim();
    if (!q) return;

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&units=metric&appid=${API_KEY}`
      );
      const data = await res.json();

      if (data.cod != 200) {
        setError(data.message || "City not found. Try another name.");
        setLoading(false);
        return;
      }

      setWeather(data);
      setCity("");
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const condition = weather?.weather?.[0]?.main || "default";
  const bg = weatherBackgrounds[condition] || weatherBackgrounds.default;
  const icon = weatherIcons[condition] || weatherIcons.default;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f172a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      padding: "2rem 1rem",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        {/* Search */}
        <form onSubmit={search} style={{ marginBottom: "1.5rem" }}>
          <div style={{
            display: "flex",
            background: "rgba(255,255,255,0.07)",
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.12)",
            overflow: "hidden",
          }}>
            <input
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="Search city…"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#fff",
                fontSize: 16,
                padding: "14px 18px",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderLeft: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
                padding: "0 20px",
                cursor: loading ? "default" : "pointer",
                fontSize: 18,
                transition: "background 0.15s",
              }}
            >
              {loading ? "…" : "→"}
            </button>
          </div>
          {error && (
            <p style={{
              color: "#f87171",
              fontSize: 13,
              margin: "8px 4px 0",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
              ⚠ {error}
            </p>
          )}
        </form>

        {/* Weather Card */}
        {weather && (
          <div style={{
            borderRadius: 24,
            background: bg,
            padding: "2rem",
            color: "#fff",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          }}>
            {/* Decorative blobs */}
            <div style={{
              position: "absolute", top: -40, right: -40,
              width: 180, height: 180,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              pointerEvents: "none",
            }} />
            <div style={{
              position: "absolute", bottom: -60, left: -30,
              width: 220, height: 220,
              borderRadius: "50%",
              background: "rgba(0,0,0,0.08)",
              pointerEvents: "none",
            }} />

            {/* Header */}
            <div style={{ position: "relative" }}>
              <p style={{ margin: 0, fontSize: 13, opacity: 0.75, letterSpacing: 1, textTransform: "uppercase" }}>
                {weather.sys.country}
              </p>
              <h1 style={{ margin: "2px 0 4px", fontSize: 32, fontWeight: 600, letterSpacing: -0.5 }}>
                {weather.name}
              </h1>
              <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>
                {getDay(weather.timezone)} · {getTime(weather.timezone)}
              </p>
            </div>

            {/* Main temp */}
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              margin: "2rem 0 1.5rem",
              position: "relative",
            }}>
              <div>
                <div style={{ fontSize: 80, fontWeight: 200, lineHeight: 1, letterSpacing: -4 }}>
                  {Math.round(weather.main.temp)}°
                </div>
                <p style={{ margin: "6px 0 0", fontSize: 15, opacity: 0.85, textTransform: "capitalize" }}>
                  {weather.weather[0].description}
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 13, opacity: 0.6 }}>
                  Feels like {Math.round(weather.main.feels_like)}°C
                </p>
              </div>
              <span style={{ fontSize: 64, marginTop: 4 }}>{icon}</span>
            </div>

            {/* Stats grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              position: "relative",
            }}>
              {[
                { label: "Humidity", value: `${weather.main.humidity}%`, icon: "💧" },
                { label: "Wind", value: `${Math.round(weather.wind.speed)} m/s`, icon: "💨" },
                { label: "Pressure", value: `${weather.main.pressure} hPa`, icon: "🌐" },
                { label: "Visibility", value: `${(weather.visibility / 1000).toFixed(1)} km`, icon: "👁" },
              ].map(stat => (
                <div key={stat.label} style={{
                  background: "rgba(0,0,0,0.18)",
                  borderRadius: 12,
                  padding: "12px 14px",
                  backdropFilter: "blur(4px)",
                }}>
                  <p style={{ margin: "0 0 4px", fontSize: 12, opacity: 0.65 }}>{stat.icon} {stat.label}</p>
                  <p style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Min/Max */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 12,
              padding: "12px 14px",
              background: "rgba(0,0,0,0.18)",
              borderRadius: 12,
              position: "relative",
            }}>
              <span style={{ fontSize: 13, opacity: 0.7 }}>
                ↓ {Math.round(weather.main.temp_min)}°C
              </span>
              <span style={{ fontSize: 13, opacity: 0.5 }}>Low / High</span>
              <span style={{ fontSize: 13, opacity: 0.7 }}>
                {Math.round(weather.main.temp_max)}°C ↑
              </span>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!weather && !loading && !error && (
          <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: "2rem 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🌍</div>
            <p style={{ fontSize: 14, margin: 0 }}>Enter a city name to see the weather</p>
          </div>
        )}
      </div>
    </div>
  );
}
