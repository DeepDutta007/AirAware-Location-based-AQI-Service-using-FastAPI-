from fastapi import APIRouter, HTTPException, Query, Request
from services.aqi_services import fetch_aqi
from models.schemas import AQIResponse
from services.ip_service import get_location_from_ip
from services.geo_service import get_location_from_city, reverse_geocode


router = APIRouter()

@router.get("/debug-ip")
async def debug_ip(request: Request):
    return {
        "detected_ip": request.headers.get("x-forwarded-for"),
        "client_host": request.client.host
    }

@router.get("/aqi", response_model=AQIResponse)
async def get_aqi(
    request: Request,
    lat: float = Query(None, ge=-90, le=90),
    lon: float = Query(None, ge=-180, le=180),
    ip: str = None,
    city: str = None
):

    # ✅ Priority 1 — coordinates
    if lat is not None and lon is not None:
        location = await reverse_geocode(lat, lon)

        aqi_data = await fetch_aqi(lat, lon)

        return {
            "ip": None,
            "location": location,
            "aqi": aqi_data["aqi"],
            "source": aqi_data["source"]
        }


    # ✅ Priority 2 — manual IP
    elif city:
        location = await get_location_from_city(city)

        if "error" in location:
            raise HTTPException(status_code=404, detail="City not found")

        aqi_data = await fetch_aqi(
            location["latitude"],
            location["longitude"]
        )

        return {
            "ip": None,
            "location": location,
            "aqi": aqi_data["aqi"],
            "source": aqi_data["source"]
        }

    elif ip:
        location = await get_location_from_ip(ip)

        if "error" in location:
            raise HTTPException(status_code=400, detail=location["error"])

        aqi_data = await fetch_aqi(
            location["latitude"],
            location["longitude"]
        )
        return {
                "ip": ip,
                "location": location,
                "aqi": aqi_data["aqi"],
                "source": aqi_data["source"]
            }

    # ✅ Priority 3 — AUTO IP
    else:
    # Get real client IP (proxy-safe)
        forwarded = request.headers.get("x-forwarded-for")

        if forwarded:
            client_ip = forwarded.split(",")[0]
        else:
            client_ip = request.client.host

        print("Detected Client IP:", client_ip)

        location = await get_location_from_ip(client_ip)

        print("Detected Client IP:", client_ip)
        print("LOCATION FROM IP:", location)

        if "error" in location:
            raise HTTPException(
                status_code=400,
                detail="Could not determine location"
            )

        aqi_data = await fetch_aqi(
            location["latitude"],
            location["longitude"]
        )


        return {
            "ip": client_ip,
            "location": location,
            "aqi": aqi_data["aqi"],
            "source": aqi_data["source"]
        }
