import os
import httpx
from tenacity import retry, stop_after_attempt, wait_fixed
from services import http_client
from functools import lru_cache

BASE_URL = os.getenv("AQI_BASE_URL")

aqi_cache = {}

@lru_cache(maxsize=128)
def cache_key(lat: float, lon: float):
    return f"{lat},{lon}"

@retry(
    stop=stop_after_attempt(3),  # retry 3 times
    wait=wait_fixed(2)           # wait 2 seconds between retries
)

async def fetch_aqi(lat: float, lon: float):

    key = cache_key(lat, lon)

    if key in aqi_cache:
                return aqi_cache[key]

    url = (
       f"{BASE_URL}?latitude={lat}&longitude={lon}&current=us_aqi"
    )

    try:
        print("Calling AQI provider...")
        response = await http_client.async_client.get(url, timeout=10)

        response.raise_for_status()  # catches bad HTTP responses

        data = response.json()

        aqi_value = data["current"]["us_aqi"]

        category = get_aqi_category(aqi_value)

        result = {
            "aqi": {
            "value": aqi_value,
            "category": category
             },
        "source": "Open-Meteo"
        }
        aqi_cache[key] = result
        return result

    except httpx.RequestError:
       return {"error": "Unable to reach AQI service"}

    except KeyError:
        return {"error": "Unexpected response from AQI provider"}
    


def get_aqi_category(aqi: float):

    if aqi <= 50:
        return "Good"
    elif aqi <= 100:
        return "Moderate"
    elif aqi <= 150:
        return "Unhealthy for Sensitive Groups"
    elif aqi <= 200:
        return "Unhealthy"
    elif aqi <= 300:
        return "Very Unhealthy"
    else:
        return "Hazardous"
