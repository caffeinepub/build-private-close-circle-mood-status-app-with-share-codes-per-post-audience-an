# Specification

## Summary
**Goal:** Fix the runtime error by ensuring the entire React app is always rendered within the existing `SoundProvider`, so `useSound` can be safely called anywhere (including the homepage/feed).

**Planned changes:**
- Add the missing global app-level wiring to wrap the app tree with the existing `SoundProvider` from `frontend/src/contexts/SoundContext.tsx`.
- Ensure routes/components that use `SoundEffectsManager` (and therefore `useSound`) render without requiring local provider wrappers or introducing any new/duplicate sound context.

**User-visible outcome:** Navigating to the homepage/feed (and any other route) no longer throws `"useSound must be used within SoundProvider"`, and sound-related components run without runtime errors.
