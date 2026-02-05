# Specification

## Summary
**Goal:** Add a private “Closest Connections” viewer and use ranked connection recommendations to make Safe People suggestions smarter, using only existing relationship/interaction data.

**Planned changes:**
- Add a new authenticated backend query API that returns a deterministically ranked list of closest-connection recommendations for the caller, including per-person human-readable explanation strings, with a caller-provided limit (or safe default) and no side effects.
- Add a centralized React Query hook to fetch closest-connection recommendations (keyed by limit), and invalidate it after relevant existing mutations (posting a status, accepting a join request, removing a circle member).
- Add a new authenticated, deep-link-only “Closest connections” page/route under the existing authenticated layout (no BottomNav item) that shows a ranked list with avatar/name and an expandable way to view explanations, plus loading/error/empty states.
- Update the Safe People selection UI to prioritize/highlight recommended candidates (max 2 still enforced), without auto-selecting/overwriting selections and without showing explanation text; add a simple navigation affordance to open the “Closest connections” viewer.

**User-visible outcome:** Users can open a private “Closest connections” page to see ranked recommended people and why they rank highly, and the Safe People chooser will surface smarter recommended candidates without changing selections automatically.
