---
description: Make a route match its design screen pixel-for-pixel
argument-hint: <screen id, e.g. 1.4-my-sizes>
---
Use the ui-builder subagent on screen $ARGUMENTS. Compare against design/screens/$ARGUMENTS.png and
design/reference/$ARGUMENTS.html, fix differences, and stop when the visual test passes. List any deviation you kept and why.
