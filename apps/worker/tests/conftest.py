from __future__ import annotations

import datetime as dt
from collections.abc import Iterator
from typing import Any

import jwt
import pytest
from cryptography.hazmat.primitives.asymmetric import rsa
from fastapi.testclient import TestClient

from tryitout_worker.common import auth as auth_module
from tryitout_worker.common.config import get_settings

SUPABASE_URL = "https://project.supabase.co"
ISSUER = f"{SUPABASE_URL}/auth/v1"
KEY_ID = "test-key"


@pytest.fixture(scope="session")
def signing_key() -> rsa.RSAPrivateKey:
    return rsa.generate_private_key(public_exponent=65537, key_size=2048)


@pytest.fixture(autouse=True)
def worker_env(monkeypatch: pytest.MonkeyPatch) -> Iterator[None]:
    monkeypatch.setenv("SUPABASE_URL", SUPABASE_URL)
    monkeypatch.setenv("SUPABASE_SERVICE_ROLE_KEY", "service-role-key-for-tests")
    monkeypatch.setenv("SUPABASE_JWKS_URL", f"{ISSUER}/.well-known/jwks.json")
    monkeypatch.delenv("SENTRY_DSN", raising=False)
    get_settings.cache_clear()
    yield
    get_settings.cache_clear()


@pytest.fixture(autouse=True)
def offline_jwks(monkeypatch: pytest.MonkeyPatch, signing_key: rsa.RSAPrivateKey) -> Iterator[None]:
    """Serve the test public key instead of fetching the project's JWKS over the network."""

    class StubKey:
        key = signing_key.public_key()

    class StubClient:
        def get_signing_key_from_jwt(self, _token: str) -> StubKey:
            return StubKey()

    auth_module._jwk_client.cache_clear()
    # monkeypatch restores the real (lru_cached) function during its own teardown.
    monkeypatch.setattr(auth_module, "_jwk_client", lambda _url: StubClient())
    yield


@pytest.fixture
def make_token(signing_key: rsa.RSAPrivateKey):  # noqa: ANN201 - pytest factory fixture
    def _make(**overrides: Any) -> str:
        now = dt.datetime.now(tz=dt.UTC)
        claims: dict[str, Any] = {
            "sub": "11111111-2222-3333-4444-555555555555",
            "aud": "authenticated",
            "iss": ISSUER,
            "role": "authenticated",
            "is_anonymous": True,
            "iat": now,
            "exp": now + dt.timedelta(hours=1),
        }
        claims.update(overrides)
        return jwt.encode(claims, signing_key, algorithm="RS256", headers={"kid": KEY_ID})

    return _make


@pytest.fixture
def client() -> TestClient:
    from tryitout_worker.api import create_app

    return TestClient(create_app())
