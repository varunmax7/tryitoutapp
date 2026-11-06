"""Modal entry point for the Tryitout worker.

    modal serve tryitout_worker/app.py          # local loop against the staging secret
    modal deploy --env staging tryitout_worker/app.py
    modal deploy --env main tryitout_worker/app.py

Scale-to-zero (``min_containers=0``) keeps the idle cost at nothing, which is what makes
the $30/month Modal credit cover V1 (§19 step 3).
"""

from __future__ import annotations

import modal

from tryitout_worker.common.sentry import init_sentry

APP_NAME = "tryitout-worker"

# Phase 0 image: the HTTP surface only. The scan, garment and build pipelines add their
# own heavier images (torch, SAM, GarmentCode, Warp) in Phases 4 to 6.
image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(
        "fastapi[standard]>=0.115",
        "pyjwt[crypto]>=2.9",
        "httpx>=0.27",
        "sentry-sdk>=2.0",
        "supabase>=2.6",
    )
    .add_local_python_source("tryitout_worker")
)

app = modal.App(APP_NAME)

# One secret per Modal environment, named `tryitout` (§13).
secrets = [modal.Secret.from_name("tryitout")]


# Modal ships untyped decorators; the ignore is scoped to these two lines.
@app.function(image=image, secrets=secrets, min_containers=0, timeout=60)  # type: ignore[untyped-decorator]
@modal.asgi_app()  # type: ignore[untyped-decorator]
def api() -> object:
    from tryitout_worker.api import create_app

    init_sentry()
    return create_app()
