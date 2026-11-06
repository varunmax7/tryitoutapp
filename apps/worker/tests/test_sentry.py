from __future__ import annotations

from tryitout_worker.common.sentry import _scrub, redact_url

# AGENTS.md rule 2: nothing that identifies a person or a photo may reach Sentry.


def test_redact_url_drops_the_query_string() -> None:
    assert redact_url("https://worker.modal.run/scan?heightCm=175") == (
        "https://worker.modal.run/scan"
    )


def test_redact_url_replaces_id_shaped_segments() -> None:
    assert redact_url("https://worker.modal.run/garment/2b5a9f10-1c3e-4b7a-9d21-8f6c4e0a7b11") == (
        "https://worker.modal.run/garment/:id"
    )


def test_redact_url_keeps_readable_paths() -> None:
    assert redact_url("https://worker.modal.run/garment/build") == (
        "https://worker.modal.run/garment/build"
    )


def test_scrub_removes_request_payloads() -> None:
    event = {
        "request": {
            "url": "https://worker.modal.run/scan?heightCm=175",
            "data": {"front": "<jpeg bytes>"},
            "headers": {"authorization": "Bearer secret"},
            "cookies": {"session": "abc"},
            "query_string": "heightCm=175",
            "env": {"REMOTE_ADDR": "1.2.3.4"},
        },
        "user": {"id": "user-1", "email": "someone@example.com", "ip_address": "1.2.3.4"},
    }
    scrubbed = _scrub(event, {})
    assert scrubbed["request"] == {"url": "https://worker.modal.run/scan"}
    assert scrubbed["user"] == {"id": "user-1"}
