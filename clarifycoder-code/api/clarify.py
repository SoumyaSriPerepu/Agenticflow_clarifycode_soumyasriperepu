from typing import List, Optional
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="ClarifyCoder Demo API")

class ClarifyRequest(BaseModel):
    problem: str
    context: Optional[str] = None

class ClarifyResponse(BaseModel):
    questions: List[str]

def heuristic_questions(problem: str, context: Optional[str]) -> List[str]:
    text = (problem or "").lower()
    qs: List[str] = []

    # simple, illustrative heuristics
    if "login" in text or "auth" in text:
        qs += [
            "Which authentication provider(s) should we support?",
            "What are session timeout and persistence requirements?",
            "Do we need MFA or SSO?"
        ]
    if "api" in text:
        qs += [
            "What are the required endpoints and methods?",
            "What is the expected response schema and error model?"
        ]
    if "db" in text or "database" in text or "sql" in text:
        qs += [
            "Which database and version are we targeting?",
            "Do we need migrations, and what are the data retention rules?"
        ]
    if not context:
        qs.append("Could you share any relevant code/config/context snippets?")

    if not qs:
        qs.append("What are the desired outputs, constraints, and success criteria?")

    # keep it brief for UI
    return qs[:6]

@app.post("/", response_model=ClarifyResponse)
async def clarify(req: ClarifyRequest) -> ClarifyResponse:
    return ClarifyResponse(questions=heuristic_questions(req.problem, req.context))
