import { useState, useEffect } from "react";

function App() {

  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const BASE_URL = "https://airaware-location-based-aqi-service.onrender.com";


  // ✅ AQI Color Helper
  const getAQIColor = (value) => {
    if (value <= 50) return "#2ecc71";     // green
    if (value <= 100) return "#f39c12";    // orange
    if (value <= 150) return "#e74c3c";    // red
    return "#8e44ad";                      // purple
  };


  // ✅ Fetch By City
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

    } catch {
      setError("Failed to fetch AQI data");

    } finally {
      setLoading(false);
    }
  };


  // ✅ Fetch Using GPS (with IP fallback)
  const fetchByLocation = () => {

    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    setLoading(true);
    setError("");
    setData(null);

    navigator.geolocation.getCurrentPosition(

      async (position) => {
        try {

          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          const response = await fetch(
            `${BASE_URL}/aqi?lat=${lat}&lon=${lon}`
          );

          const result = await response.json();
          setData(result);

        } catch {
          setError("Failed to fetch AQI data");
        } finally {
          setLoading(false);
        }
      },

      // 👉 If GPS denied → fallback to IP
      async () => {
        try {

          const response = await fetch(`${BASE_URL}/aqi`);
          const result = await response.json();
          setData(result);

        } catch {
          setError("Failed to fetch AQI data");
        } finally {
          setLoading(false);
        }
      }
    );
  };


  // ✅ AUTO LOAD ON START (Huge UX upgrade)
  useEffect(() => {
    fetchByLocation();
  }, []);


  return (

    <div
      style={{
        padding: "40px",
        fontFamily: "Arial",
        maxWidth: "600px",
        margin: "auto",
        textAlign: "center"
      }}
    >

      <h1>🌍 AirAware</h1>


      {/* GPS Button */}
      <button
        onClick={fetchByLocation}
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
          cursor: "pointer"
        }}
      >
        Use My Location
      </button>


      {/* City Search */}
      <div>
        <input
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchByCity()}
          style={{
            padding: "10px",
            width: "65%",
            marginRight: "10px"
          }}
        />

        <button
          onClick={fetchByCity}
          style={{
            padding: "10px 15px",
            cursor: "pointer"
          }}
        >
          Check City AQI
        </button>
      </div>


      {/* Loading */}
      {loading && <p style={{ marginTop: "20px" }}>Loading...</p>}


      {/* Error */}
      {error && (
        <p style={{ color: "red", marginTop: "20px" }}>
          {error}
        </p>
      )}


      {/* RESULT CARD */}
      {data && (

        <div
          style={{
            marginTop: "30px",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)"
          }}
        >

          <h2>
            {data.location.city}, {data.location.country}
          </h2>

          <p
            style={{
              fontSize: "42px",
              fontWeight: "bold",
              color: getAQIColor(data.aqi.value),
              margin: "10px 0"
            }}
          >
            {data.aqi.value}
          </p>

          <p style={{ fontSize: "18px" }}>
            {data.aqi.category}
          </p>

        </div>
      )}

    </div>
  );
}

export default App;
