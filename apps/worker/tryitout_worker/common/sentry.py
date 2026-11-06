"""Sentry for the worker — implementation.md §15 Phase 0 task 8.

A body photo must never reach an error report, so request bodies and PII are off and
id-shaped URL segments are redacted before an event leaves the container.
"""

from __future__ import annotations

import re
from typing import TYPE_CHECKING, Any
from urllib.parse import urlsplit, urlunsplit

import sentry_sdk

if TYPE_CHECKING:
    from sentry_sdk.types import Event, Hint

from .config import get_settings

_ID_SEGMENT = re.compile(
    r"^(?:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}|[A-Za-z0-9_-]{16,})$"
)


def redact_url(raw: str) -> str:
    parts = urlsplit(raw)
    path = "/".join(":id" if _ID_SEGMENT.match(seg) else seg for seg in parts.path.split("/"))
    return urlunsplit((parts.scheme, parts.netloc, path, "", ""))


def _scrub(event: Event, _hint: Hint) -> Event:
    request: Any = event.get("request")
    if isinstance(request, dict):
        for key in ("data", "cookies", "headers", "query_string", "env"):
            request.pop(key, None)
        if isinstance(request.get("url"), str):
            request["url"] = redact_url(request["url"])
    user: Any = event.get("user")
    if isinstance(user, dict):
        event["user"] = {"id": user["id"]} if "id" in user else {}
    return event


def init_sentry() -> None:
    settings = get_settings()
    if not settings.sentry_dsn:
        return
    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        environment=settings.app_env,
        release=f"tryitout-worker@{_version()}",
        send_default_pii=False,
        max_request_body_size="never",
        traces_sample_rate=0.2,
        before_send=_scrub,
    )


def _version() -> str:
    from tryitout_worker import __version__

    return __version__
