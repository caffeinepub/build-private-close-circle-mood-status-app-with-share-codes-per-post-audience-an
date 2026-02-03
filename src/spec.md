# Specification

## Summary
**Goal:** Add optional, private mood context tags to the status compose flow, stored with each post but only visible to the author.

**Planned changes:**
- Extend the backend StatusPost model to store an optional list of context tags per post, and accept/persist tags when creating a status (default to an empty list when not provided).
- Ensure context tags remain private by omitting/emptying them in getFeed and getStatus responses for any caller who is not the post author, while returning them for the author.
- Update the Compose Status page to show a subtle “context tags” section only after a mood is selected, supporting multi-select from predefined tags plus adding/removing custom tags.
- Add a soft-limit UX for tag selection with calm inline guidance when exceeded (posting still allowed).
- Add lightweight frontend validation/normalization for custom tags (trim, block empty, prevent case-insensitive duplicates, enforce a max length with an inline message).
- Ensure tags are sent with status submissions but are not displayed anywhere in feed/status UI for non-authors.

**User-visible outcome:** After selecting a mood while composing a status, the author can optionally add private context tags (predefined or custom) to help personal context; these tags are saved with the post but are not shown to other users in the feed or status views.
