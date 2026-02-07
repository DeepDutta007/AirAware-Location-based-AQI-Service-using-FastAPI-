import os
from services import http_client

IP_BASE_URL = os.getenv("IP_BASE_URL")

async def get_location_from_ip(ip: str):

    url = f"{IP_BASE_URL}/{ip}"

    response = await http_client.async_client.get(url, timeout=10)
    data = response.json()

    # ipwho returns a success flag
    if not data.get("success", False):
        return {"error": "Invalid IP address"}

    return {
        "city": data.get("city", "Unknown"),
        "region": data.get("region", "Unknown"),
        "country": data.get("country", "Unknown"),
        "latitude": data["latitude"],
        "longitude": data["longitude"]
}
