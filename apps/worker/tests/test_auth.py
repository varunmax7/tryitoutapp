from __future__ import annotations

import datetime as dt

import jwt
import pytest
from cryptography.hazmat.primitives.asymmetric import rsa
from fastapi.testclient import TestClient

from tests.conftest import ISSUER

# implementation.md §15 Phase 0 acceptance:
# "modal serve health returns 200 with a valid JWT and 401 without".


def test_health_returns_200_with_a_valid_jwt(client: TestClient, make_token) -> None:
    response = client.get("/health", headers={"Authorization": f"Bearer {make_token()}"})
    assert response.status_code == 200
    body = response.json()
    assert body["ok"] is True
    assert body["authenticated"] is True
    # The response must not leak the subject or any other claim.
    assert "id" not in body
    assert "sub" not in body


def test_health_returns_401_without_a_token(client: TestClient) -> None:
    response = client.get("/health")
    assert response.status_code == 401
    assert response.json()["detail"]["error"]["code"] == "unauthorized"


@pytest.mark.parametrize(
    "header",
    ["", "Bearer", "Bearer ", "Basic abc", "token abc"],
)
def test_malformed_authorization_headers_are_refused(client: TestClient, header: str) -> None:
    response = client.get("/health", headers={"Authorization": header})
    assert response.status_code == 401


def test_expired_token_is_refused(client: TestClient, make_token) -> None:
    past = dt.datetime.now(tz=dt.UTC) - dt.timedelta(hours=2)
    token = make_token(iat=past, exp=past + dt.timedelta(minutes=1))
    response = client.get("/health", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401


def test_wrong_audience_is_refused(client: TestClient, make_token) -> None:
    token = make_token(aud="anon")
    response = client.get("/health", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401


def test_wrong_issuer_is_refused(client: TestClient, make_token) -> None:
    token = make_token(iss="https://attacker.example/auth/v1")
    response = client.get("/health", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401


def test_token_without_a_subject_is_refused(client: TestClient, make_token) -> None:
    token = make_token(sub="")
    response = client.get("/health", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401


def test_symmetric_token_is_refused(client: TestClient) -> None:
    """A leaked anon key must never be usable to mint a token the worker trusts."""
    now = dt.datetime.now(tz=dt.UTC)
    token = jwt.encode(
        {
            "sub": "11111111-2222-3333-4444-555555555555",
            "aud": "authenticated",
            "iss": ISSUER,
            "iat": now,
            "exp": now + dt.timedelta(hours=1),
        },
        "a-shared-secret-long-enough-for-sha256-hmac",
        algorithm="HS256",
    )
    response = client.get("/health", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401


def test_token_signed_by_another_key_is_refused(client: TestClient) -> None:
    other = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    now = dt.datetime.now(tz=dt.UTC)
    token = jwt.encode(
        {
            "sub": "11111111-2222-3333-4444-555555555555",
            "aud": "authenticated",
            "iss": ISSUER,
            "iat": now,
            "exp": now + dt.timedelta(hours=1),
        },
        other,
        algorithm="RS256",
    )
    response = client.get("/health", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401
