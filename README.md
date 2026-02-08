## Live API
https://your-render-url/docs

## Check the Live website for iteraction
https://air-aware-location-based-aqi-service-frontend-e4pm31dhv.vercel.app/

## AirAware: Location-based AQI Service using FastAPI

Designed and implemented a production ready FastAPI backend that determines a client’s geographic location from their IP address and retrieves real-time air quality information for that location.

## Features

- Async FastAPI architecture for high performance
- Location-aware AQI retrieval (city, IP, or coordinates)
- Reverse geocoding for human-readable locations
- Resilient external API handling with retries
- In-memory caching to reduce latency
- Environment-based configuration
- Structured response models with Pydantic
- Middleware logging for request tracing

## Tech used/Libraries

- FastAPI
- Python
- HTTPX (async HTTP client)
- Pydantic
- Open-Meteo API (For getting the details using IP)
- OpenStreetMap (For getting the details using city)

## Architecture

The application follows a service-based architecture:

routers/ → API endpoints  
services/ → External API integrations  
models/ → Pydantic schemas  
middleware → Request logging  

This separation ensures scalability, maintainability, and clean dependency boundaries.

## Why ipwho.is and Open-Meteo were selected
Ipwho.is (often referred to as IP Geolocation API - IPWHOIS.io) is a real-time IP geolocation API service that provides fast, accurate, and multilingual data for IPv4 and IPv6 addresses. It is used by developers and companies to determine the country, region, city, ISP, and location of an IP address, with IP Geolocation API - IPWHOIS.io featuring a self-learning neural network for updates. 

Open-Meteo is an open-source weather API and offers free access for non-commercial use and no API key is required which makes it easier to use. We can easily use this to get the latitude and longitude coordinates and get the air quality index easily from there. But reverse searching with city was not possible so I switched to BigDataCloud API which allows us to reverse search with the city to give us the details which will be needed for us to get the desired output.

## Caching strategy
I have implemented by api_cache = TTLCache(maxsize=100, ttl=600), which will have maximum size of 100 items to remain in the cache and items will be there 600s, i.e., it will be available in the cache for 10 minutes only and after that it gets deleted.

## Handling of private/local IP addresses
I have added it like this, where if a user with a private/local IP addresses try to access it, they will be notified that their Private IP addresses cannot be geolocated.