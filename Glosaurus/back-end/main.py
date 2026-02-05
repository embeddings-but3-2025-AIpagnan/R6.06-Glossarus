import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes import synonym

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

logger.info("Starting Glosaurus backend application")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(synonym.router)
