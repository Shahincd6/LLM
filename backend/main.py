from fastapi.responses import RedirectResponse
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from groq_client import query_groq

app = FastAPI()

# Update with your Vercel domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://llm-three-eta.vercel.app",  
    ],
    allow_credentials=True,  # Important for cookies/authentication if needed
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the LLM API. Use /chat endpoint for chat functionality."}

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


@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_redirect():
    return RedirectResponse(url="/docs")