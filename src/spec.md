# Specification

## Summary
**Goal:** Simplify onboarding by removing the “Looking for?” (romantic vs friendship) question while keeping profile creation and updates valid.

**Planned changes:**
- Remove the intent selection step (Friendship/Romantic/Both) from the multi-step onboarding flow in `frontend/src/components/profile/ProfileSetupDialog.tsx` and ensure the flow still reaches the share-code step.
- Apply a safe, consistent default for `relationshipIntent` and `preferences.intent` during new profile creation so required backend fields are still sent without user input.
- Remove the “Looking For” section from `frontend/src/pages/ProfilePage.tsx` in both view and edit modes, while preserving functional profile saving and ensuring a valid `relationshipIntent` is still sent (e.g., using the stored value).

**User-visible outcome:** New users complete onboarding without being asked romantic vs friendship, and the Profile page no longer shows that field while profile saving continues to work.
