import { useState } from "react";

function App() {
  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const BASE_URL = "https://airaware-location-based-aqi-service.onrender.com";

  // ✅ Fetch using city
  const fetchByCity = async () => {
    if (!city) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await fetch(
        `${BASE_URL}/aqi?city=${encodeURIComponent(city)}`
      );

      if (!response.ok) {
        throw new Error("City not found");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError("Failed to fetch AQI data");
    }

    setLoading(false);
  };

  // ✅ Fetch using device IP
  const fetchByIP = async () => {
    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await fetch(`${BASE_URL}/aqi`);

      if (!response.ok) {
        throw new Error("Could not detect location");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError("Failed to fetch AQI data");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>🌍 AQI Checker</h1>

      {/* Auto location */}
      <button onClick={fetchByIP} style={{ marginBottom: "20px" }}>
        Use My Location
      </button>

      <div>
        <input
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ padding: "8px", marginRight: "10px" }}
        />

        <button onClick={fetchByCity}>
          Check City AQI
        </button>
      </div>

      {/* Loading */}
      {loading && <p>Loading...</p>}

      {/* Error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Result */}
      {data && (
        <div style={{ marginTop: "20px" }}>
          <h2>{data.location.city}</h2>
          <p><strong>AQI:</strong> {data.aqi.value}</p>
          <p><strong>Category:</strong> {data.aqi.category}</p>
        </div>
      )}
    </div>
  );
}

export default App;