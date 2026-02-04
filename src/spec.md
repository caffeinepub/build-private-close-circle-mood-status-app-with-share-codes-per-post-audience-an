# Specification

## Summary
**Goal:** Add profile avatars so users can either upload a PNG/JPEG (≤1000KB) or choose from a bundled set of system avatars on the existing Profile edit screen.

**Planned changes:**
- Extend the backend user profile model to store an optional avatar choice: either a system avatar identifier or uploaded image bytes + content type.
- Add backend validation for avatar uploads (PNG/JPEG only, maximum size 1000KB) with clear English error messages.
- Update backend profile read endpoints to return the avatar data needed for rendering (including uploaded bytes/content type or system avatar id).
- Update the Profile page UI to show the current avatar (with a fallback when none is set).
- In Profile edit mode, add an avatar picker that allows selecting a bundled system avatar or uploading a validated local file, with inline/toast errors for invalid files.
- Bundle a fixed set of system avatar images in the frontend as static assets and persist selection via stable identifiers.

**User-visible outcome:** On the Profile page, users see their current avatar; in Profile edit they can upload a new PNG/JPEG avatar (≤1000KB) or pick from a fixed set of built-in avatars, save, and see the choice persist after reload.
