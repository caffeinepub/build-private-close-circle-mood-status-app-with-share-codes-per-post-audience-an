# Specification

## Summary
**Goal:** Track and surface real directed interaction counts (author → recipient) from backend status posts and Silent Signal posts so Closest Connections shows accurate non-zero interaction totals, while continuing to exclude passive views and join-request acceptance.

**Planned changes:**
- Add backend storage for directed interaction counts keyed by (fromPrincipal → toPrincipal) and a safe increment helper that prevents self-increments and supports monotonically increasing counts.
- Update backend status posting flow to increment (author → recipient) by 1 for each recipient in the backend-computed final audience for Whole circle, Specific people, and Only Safe People; do not increment for Just me posts.
- Update backend Silent Signal posting flow to increment (author → recipient) by 1 for each recipient resolved by backend audience logic; do not add any new notifications as part of this tracking.
- Update `getBestCircleConnectionsWithWhyExplanation` so `ConnectionWhyExplanation.interaction` reflects totals derived from the new interaction tracking (still excluding passive views and join-request acceptance) without breaking the existing API shape.
- Ensure the frontend Closest Connections page continues to display the backend-provided Interaction Count correctly after refetch, without additional UI copy changes.

**User-visible outcome:** After posting statuses (to eligible audiences) or sending Silent Signals, users will see updated, non-zero Interaction counts for affected people on the Closest Connections page after data refresh, while views and join-request acceptance continue not to affect the count.
