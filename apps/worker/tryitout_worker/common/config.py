"""Worker configuration.

Every value comes from the Modal secret named ``tryitout``, one per Modal environment
(implementation.md §13). Nothing is hard-coded and nothing is logged.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache


class ConfigError(RuntimeError):
    """Raised when a required secret is missing, so the container fails fast."""


@dataclass(frozen=True)
class Settings:
    supabase_url: str
    supabase_service_role_key: str
    supabase_jwks_url: str
    r2_account_id: str | None
    r2_write_key_id: str | None
    r2_write_secret: str | None
    r2_bucket: str | None
    sentry_dsn: str | None
    app_env: str

    # Free-tier caps (§13), overridable per environment.
    cap_scans_per_day: int
    cap_garment_analyses_per_day: int
    cap_builds_per_day: int

    @property
    def jwt_issuer(self) -> str:
        return f"{self.supabase_url.rstrip('/')}/auth/v1"


def _required(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise ConfigError(f"Missing required environment variable: {name}")
    return value


def _int(name: str, default: int) -> int:
    raw = os.environ.get(name)
    if raw is None or raw == "":
        return default
    try:
        return int(raw)
    except ValueError as cause:
        raise ConfigError(f"{name} must be an integer, got {raw!r}") from cause


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    supabase_url = _required("SUPABASE_URL")
    return Settings(
        supabase_url=supabase_url,
        supabase_service_role_key=_required("SUPABASE_SERVICE_ROLE_KEY"),
        # Defaults to the project's JWKS endpoint when the secret does not pin one.
        supabase_jwks_url=os.environ.get("SUPABASE_JWKS_URL")
        or f"{supabase_url.rstrip('/')}/auth/v1/.well-known/jwks.json",
        r2_account_id=os.environ.get("R2_ACCOUNT_ID"),
        r2_write_key_id=os.environ.get("R2_WRITE_KEY_ID"),
        r2_write_secret=os.environ.get("R2_WRITE_SECRET"),
        r2_bucket=os.environ.get("R2_BUCKET"),
        sentry_dsn=os.environ.get("SENTRY_DSN"),
        app_env=os.environ.get("APP_ENV", "local"),
        cap_scans_per_day=_int("CAP_SCANS_PER_DAY", 2),
        cap_garment_analyses_per_day=_int("CAP_GARMENT_ANALYSES_PER_DAY", 10),
        cap_builds_per_day=_int("CAP_BUILDS_PER_DAY", 5),
    )
