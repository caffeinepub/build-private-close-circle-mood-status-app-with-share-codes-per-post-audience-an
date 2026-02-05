# Specification

## Summary
**Goal:** Add 12 new “Physical State” moods across backend and frontend with matching English labels and emojis.

**Planned changes:**
- Extend the Motoko `Mood` variant type in `backend/main.mo` with: `#thirsty`, `#dehydrated`, `#sleepy`, `#wired`, `#sore`, `#bloated`, `#overheated`, `#cold`, `#headache`, `#nauseous`, `#lightheaded`, `#restless`.
- Update `module Mood.toText` in `backend/main.mo` to return the correct English labels for the 12 new moods, including exactly `Wired (too much caffeine)` for `#wired`.
- Update `frontend/src/constants/moods.ts` to add the 12 new moods under the existing `physical-state` category using the specified label+emoji pairs so they appear in all MoodPicker usages (Daily Check-In and Compose).

**User-visible outcome:** Users can select any of the 12 new Physical State moods (with the specified emojis) anywhere the mood picker is available, including Daily Check-In and Compose.
