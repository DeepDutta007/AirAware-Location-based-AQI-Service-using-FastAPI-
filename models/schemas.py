from pydantic import BaseModel
from typing import Optional

class Location(BaseModel):
    city: str
    region: str
    country: str
    latitude: float
    longitude: float


class AQIData(BaseModel):
    value: float
    category: str

class AQIResponse(BaseModel):
    ip: Optional[str]
    location: Location
    aqi: AQIData
    source: str
