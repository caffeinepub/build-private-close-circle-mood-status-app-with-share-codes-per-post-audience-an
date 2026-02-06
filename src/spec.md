# Specification

## Summary
**Goal:** Remove relationship intent (Romantic/Friendship/Both) badge/text from the Circle Members list UI.

**Planned changes:**
- Update the Circle page’s Members tab list item/row UI to no longer render relationship intent text/badges.
- Clean up any members-list component code so relationship-intent-related imports/types are removed and the TypeScript build remains clean.

**User-visible outcome:** On `/authenticated/circle` under the Members tab, member rows no longer show relationship intent labels, while other existing metadata (e.g., name/age, gender, pulse badge) continues to display as before.
