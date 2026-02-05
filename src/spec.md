# Specification

## Summary
**Goal:** Add a “Mark all as read” action on the Notifications/Alerts page and ensure notification read-state updates immediately (including the bottom-nav unread badge).

**Planned changes:**
- Add a “Mark all as read” button near the top of `frontend/src/pages/NotificationsPage.tsx`, shown or enabled only when there is at least one unread notification.
- Implement a backend method in `backend/main.mo` to mark all of the authenticated caller’s notifications as read (without affecting other users), following existing notifications authorization patterns.
- Add a centralized React Query mutation in `frontend/src/hooks/useQueries.ts` to call the new backend method and invalidate/refetch the `['notifications']` query on success (to immediately clear unread counts and the bottom-nav badge).
- Ensure tapping an individual notification marks it as read before/alongside navigation, using existing per-notification mark-as-read behavior or adding the necessary backend API + React Query mutation, and invalidating `['notifications']` so counts/badge update immediately.
- Add in-progress (disabled/loading) and error handling for the mark-all operation using the app’s standard toast/error UI.

**User-visible outcome:** On the Notifications page, users can tap “Mark all as read” to instantly clear all unread notifications and remove the unread badge, and tapping a single notification reliably marks it as read immediately as they navigate.
