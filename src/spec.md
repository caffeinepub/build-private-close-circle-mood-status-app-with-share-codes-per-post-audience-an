# Specification

## Summary
**Goal:** Ensure logout always returns users to the public homepage ("/") and prevents authenticated-only pages from remaining visible after identity is cleared.

**Planned changes:**
- Update the authenticated header “Sign Out” action to redirect to "/" after logout completes, using replace-style navigation while preserving existing React Query cache clearing.
- Add a guard in the authenticated layout/routing so that if the Internet Identity becomes undefined (and initialization is not in progress), the app immediately redirects to "/".
- Ensure authenticated-only routes redirect to "/" when accessed without an active identity, without causing redirect loops during initial identity loading.

**User-visible outcome:** From any logged-in page, clicking “Sign Out” reliably returns the user to the public homepage ("/") and they cannot remain on or navigate back to authenticated-only pages after logging out.
