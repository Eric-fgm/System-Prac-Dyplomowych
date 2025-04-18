from fastapi import FastAPI
from api.routes import root

app = FastAPI(title="My FastAPI App", version="0.1")

app.include_router(root.router)
