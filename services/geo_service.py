import os
from services import http_client

GEO_BASE_URL = "https://geocoding-api.open-meteo.com/v1/search"


async def get_location_from_city(city: str):

    url = f"{GEO_BASE_URL}?name={city}&count=1"

    response = await http_client.async_client.get(url, timeout=10)
    response.raise_for_status()

    data = response.json()

    if not data.get("results"):
        return {"error": "City not found"}

    result = data["results"][0]

    return {
        "city": result["name"],
        "region": result.get("admin1", "Unknown"),
        "country": result["country"],
        "latitude": result["latitude"],
        "longitude": result["longitude"]
    }

async def reverse_geocode(lat: float, lon: float):

    url = "https://nominatim.openstreetmap.org/reverse"

    params = {
        "lat": lat,
        "lon": lon,
        "format": "json"
    }

    headers = {
        "User-Agent": "aqi-app"   # REQUIRED by Nominatim
    }

    try:
        response = await http_client.async_client.get(
            url,
            params=params,
            headers=headers,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()
        address = data.get("address", {})

        return {
            "city": address.get("city")
                    or address.get("town")
                    or address.get("village")
                    or "Unresolved",

            "region": address.get("state", "Unresolved"),
            "country": address.get("country", "Unresolved"),
            "latitude": lat,
            "longitude": lon
        }

    except Exception as e:
        print("Reverse geocode failed:", e)

        return {
            "city": "Unresolved",
            "region": "Unresolved",
            "country": "Unresolved",
            "latitude": lat,
            "longitude": lon
        }


