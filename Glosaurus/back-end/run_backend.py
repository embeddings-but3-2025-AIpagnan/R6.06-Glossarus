import logging

import uvicorn
from main import app

logger = logging.getLogger(__name__)

if __name__ == "__main__":
    logger.info("Starting Glosaurus backend server on http://0.0.0.0:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000)
