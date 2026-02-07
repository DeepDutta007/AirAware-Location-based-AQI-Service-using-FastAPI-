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

