import { useState, useEffect } from "react";

function App() {

  const [city, setCity] = useState("");
  const [data, setData] = useState(null);
  const [showJSON, setShowJSON] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const BASE_URL = "https://airaware-location-based-aqi-service.onrender.com";


  const getAQIColor = (value) => {
    if (!value) return "#ffffff";
    if (value <= 50) return "#2ecc71";
    if (value <= 100) return "#f39c12";
    if (value <= 150) return "#e74c3c";
    return "#8e44ad";
  };


  const fetchByCity = async () => {

    if (!city.trim()) return;

    setLoading(true);
    setError("");
    setData(null);

    try {

      const response = await fetch(
        `${BASE_URL}/aqi?city=${encodeURIComponent(city)}`
      );

      if (!response.ok) throw new Error();

      const result = await response.json();
      setData(result);

    } catch {
      setError("Failed to fetch AQI data");
    } finally {
      setLoading(false);
    }
  };

    const fetchByIP = async () => {

    setLoading(true);
    setError("");
    setData(null);

    try {

      const response = await fetch(`${BASE_URL}/aqi`);

      if (!response.ok) {
        throw new Error();
    }

    const result = await response.json();
    setData(result);

  } catch {
      setError("Failed to detect location");
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchByIP();
  }, []);



  return (

    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #0f172a, #020617)",
        fontFamily: "Arial"
      }}
    >

      {/* MAIN CARD */}
      <div
        style={{
          width: "90%",
          maxWidth: "520px",
          padding: "50px",
          borderRadius: "18px",
          background: "#111827",
          boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
          textAlign: "center"
        }}
      >

        <h1 style={{ color: "white", fontSize: "34px" }}>
          🌍 AirAware
        </h1>

        <p style={{ color: "#9ca3af", marginBottom: "30px" }}>
          Real-time Air Quality Index
        </p>


        {/* LOCATION BUTTON */}
        <button
          onClick={fetchByIP}
          disabled={loading}
          style={{
            padding: "12px 26px",
            borderRadius: "10px",
            border: "none",
            background: "#2563eb",
            color: "white",
            cursor: "pointer",
            marginBottom: "30px",
            fontSize: "15px"
          }}
        >
          Detect My AQI
        </button>



        {/* CITY SEARCH */}
        <div style={{ marginBottom: "20px" }}>

          <input
            placeholder="Enter city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchByCity()}
            style={{
              padding: "12px",
              width: "75%",
              borderRadius: "10px",
              border: "1px solid #374151",
              background: "#020617",
              color: "white",
              marginBottom: "15px"
            }}
          />

          <br />

          <button
            onClick={fetchByCity}
            style={{
              padding: "10px 22px",
              borderRadius: "10px",
              border: "1px solid #2563eb",
              background: "transparent",
              color: "#2563eb",
              cursor: "pointer"
            }}
          >
            Check City AQI
          </button>

        </div>



        {/* JSON BUTTON */}
        {data && (
          <button
            onClick={() => setShowJSON(!showJSON)}
            style={{
              marginTop: "10px",
              padding: "6px 14px",
              fontSize: "13px",
              borderRadius: "8px",
              border: "none",
              background: "#374151",
              color: "white",
              cursor: "pointer"
            }}
          >
            {showJSON ? "Hide Raw JSON" : "Show Raw JSON"}
          </button>
        )}



        {loading && (
          <p style={{ marginTop: "20px", color: "white" }}>
            Loading...
          </p>
        )}

        {error && (
          <p style={{ color: "#ef4444", marginTop: "20px" }}>
            {error}
          </p>
        )}



        {/* RESULT */}
        {data && (

          <div
            style={{
              marginTop: "30px",
              padding: "30px",
              borderRadius: "16px",
              background: getAQIColor(data.aqi?.value) + "22",
              border: `1px solid ${getAQIColor(data.aqi?.value)}`,
              color: "white"
            }}
          >

            <h2>
              {data.location?.city}, {data.location?.country}
            </h2>

            <p
              style={{
                fontSize: "56px",
                fontWeight: "bold",
                color: getAQIColor(data.aqi?.value),
                margin: "10px 0"
              }}
            >
              {data.aqi?.value}
            </p>

            <p style={{ fontSize: "18px" }}>
              {data.aqi?.category}
            </p>

          </div>
        )}



        {/* RAW JSON VIEWER */}
        {showJSON && data && (

          <pre
            style={{
              marginTop: "20px",
              textAlign: "left",
              background: "#020617",
              padding: "15px",
              borderRadius: "10px",
              overflowX: "auto",
              color: "#22c55e",
              fontSize: "13px"
            }}
          >
            {JSON.stringify(data, null, 2)}
          </pre>
        )}

      </div>
    </div>
  );
}

export default App;
