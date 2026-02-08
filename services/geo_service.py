import os, logging, httpx
from services import http_client

GEO_BASE_URL = "https://geocoding-api.open-meteo.com/v1/search"

logger = logging.getLogger(__name__)

async def get_location_from_city(city: str):

    url = f"{GEO_BASE_URL}?name={city}&count=1"

    try:
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

    except httpx.TimeoutException:
        logger.error("Forward geocode timeout")
        return {"error": "Geolocation service timed out"}

    except httpx.HTTPError as e:
        logger.error(f"Forward geocode failed: {e}")
        return {"error": "Geolocation service unavailable"}

async def reverse_geocode(lat: float, lon: float):

    url = "https://api.bigdatacloud.net/data/reverse-geocode-client"

    params = {
        "latitude": lat,
        "longitude": lon,
        "localityLanguage": "en"
    }

    try:

        response = await http_client.async_client.get(
            url,
            params=params,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()

        return {
            "city": data.get("city")
                    or data.get("locality")
                    or "Unresolved",

            "region": data.get("principalSubdivision", "Unresolved"),
            "country": data.get("countryName", "Unresolved"),
            "latitude": lat,
            "longitude": lon
        }

    except httpx.HTTPError as e:
        logger.error(f"Reverse geocode failed: {e}")

        return {
            "city": "Unresolved",
            "region": "Unresolved",
            "country": "Unresolved",
            "latitude": lat,
            "longitude": lon
        }