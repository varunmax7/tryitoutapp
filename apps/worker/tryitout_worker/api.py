"""The worker's HTTP surface, as a plain FastAPI app.

Kept free of any Modal import so the tests can exercise it without Modal installed.
``app.py`` wraps this for deployment.
"""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, FastAPI

from tryitout_worker import __version__
from tryitout_worker.common.auth import User, require_user

# Every route needs a verified Supabase JWT (§10). Adding the dependency to the router,
# not to each endpoint, means a new endpoint cannot accidentally ship unauthenticated.
router = APIRouter(dependencies=[Depends(require_user)])


@router.get("/health")
def health(user: Annotated[User, Depends(require_user)]) -> dict[str, object]:
    """Liveness for the worker. 200 with a valid JWT, 401 without (Phase 0 acceptance)."""
    return {
        "ok": True,
        "version": __version__,
        # Proves the token was verified without echoing any claim that identifies a person.
        "authenticated": True,
        "anonymous": user.is_anonymous,
    }


def create_app() -> FastAPI:
    app = FastAPI(
        title="Tryitout worker",
        version=__version__,
        docs_url=None,
        redoc_url=None,
        openapi_url=None,
    )
    app.include_router(router)
    return app
