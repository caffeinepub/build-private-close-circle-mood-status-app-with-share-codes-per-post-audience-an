# Specification

## Summary
**Goal:** Allow users who have zero circle members to post mood/status updates that are private (self-only), and keep those posts private even after they later join a circle.

**Planned changes:**
- Update backend status-posting validation to allow posting when the audience is self-only (caller-only) even if the caller has no circle record, while still rejecting any non-self recipients when no circle exists.
- Ensure backend always stores a self-visible audience by including the caller in the saved audience (deduplicated), and treats empty/missing audience as self-only.
- Update ComposeStatusPage so users with no selectable circle members can still submit, with the UI indicating the post will be private/self-only in English copy.
- Update DailyCheckInPage so users with no selectable circle members can still submit, with the UI indicating the post will be private/self-only in English copy.
- Preserve privacy rules so self-only posts remain visible only to the author even if the user later joins a circle.

**User-visible outcome:** Users without any circle members can post mood/status updates as private (self-only) from Compose and Daily Check-in, and those private posts remain visible only to them in the future.
