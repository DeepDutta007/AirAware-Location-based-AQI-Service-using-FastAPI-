from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, Request
from routers.aqi import router as aqi_router
from services import http_client
import httpx
import time

app = FastAPI()

@app.middleware("http")
async def log_requests(request: Request, call_next):

    start_time = time.time()

    print(f"Incoming request → {request.method} {request.url.path}")

    response = await call_next(request)

    duration = time.time() - start_time

    print(f"Completed in {duration:.2f}s")

    return response

@app.on_event("startup")
async def startup_event():
    http_client.async_client = httpx.AsyncClient()

@app.on_event("shutdown")
async def shutdown_event():
    await http_client.async_client.aclose()

app.include_router(aqi_router)

@app.get("/")
def root():
    return {"message": "Server is running"}
