# backend/main.py

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from groq_client import query_groq

app = FastAPI()

# Allow frontend dev environment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
async def chat(request: Request):
    body = await request.json()
    user_prompt = body.get("prompt", "")
    if not user_prompt:
        return {"response": "Empty prompt received."}

    try:
        response = await query_groq(user_prompt)
        return {"response": response}
    except Exception as e:
        return {"response": f"Error: {str(e)}"}
