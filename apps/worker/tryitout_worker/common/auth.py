"""Supabase JWT verification for every worker request.

implementation.md §10: "Every call carries the user's Supabase JWT, verified against the
project's JWKS." Verification is asymmetric, so the worker never holds a signing secret.
"""

from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache
from typing import Annotated, Any

import jwt
from fastapi import Depends, HTTPException, Request, status
from jwt import PyJWKClient

from .config import Settings, get_settings

# Supabase issues asymmetric project keys; HS256 is refused so a leaked anon key can
# never be used to mint a token the worker would trust.
ALLOWED_ALGORITHMS = ("RS256", "ES256", "EdDSA")
AUDIENCE = "authenticated"


@dataclass(frozen=True)
class User:
    """The only identity the worker keeps: the Supabase user id and how they signed in."""

    id: str
    is_anonymous: bool
    role: str


class AuthError(HTTPException):
    def __init__(self, message: str) -> None:
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": {"code": "unauthorized", "message": message}},
            headers={"WWW-Authenticate": "Bearer"},
        )


@lru_cache(maxsize=4)
def _jwk_client(jwks_url: str) -> PyJWKClient:
    # PyJWKClient caches keys, so a warm container does not refetch on every request.
    return PyJWKClient(jwks_url, cache_keys=True, lifespan=3600)


def bearer_token(request: Request) -> str:
    header = request.headers.get("authorization", "")
    scheme, _, token = header.partition(" ")
    if scheme.lower() != "bearer" or not token.strip():
        raise AuthError("Missing bearer token.")
    return token.strip()


def verify_token(token: str, settings: Settings) -> dict[str, Any]:
    try:
        signing_key = _jwk_client(settings.supabase_jwks_url).get_signing_key_from_jwt(token)
        return jwt.decode(
            token,
            signing_key.key,
            algorithms=list(ALLOWED_ALGORITHMS),
            audience=AUDIENCE,
            issuer=settings.jwt_issuer,
            options={"require": ["exp", "sub", "aud", "iss"]},
        )
    except jwt.PyJWTError as cause:
        # The reason is deliberately not echoed back to the caller.
        raise AuthError("Invalid or expired token.") from cause


def require_user(
    request: Request,
    settings: Annotated[Settings, Depends(get_settings)],
) -> User:
    """FastAPI dependency applied to every worker route."""
    claims = verify_token(bearer_token(request), settings)
    subject = claims.get("sub")
    if not isinstance(subject, str) or not subject:
        raise AuthError("Token has no subject.")
    return User(
        id=subject,
        is_anonymous=bool(claims.get("is_anonymous", False)),
        role=str(claims.get("role", "authenticated")),
    )
