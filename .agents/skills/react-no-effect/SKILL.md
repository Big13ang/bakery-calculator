---
name: react-no-effect
description: >
  React guidance for eliminating unnecessary useEffect calls. Use this skill whenever
  you see or write a useEffect, whenever the user asks "do I need a useEffect", whenever
  a component has state that's derived from other state/props, whenever you see chained
  Effects, Effect-based event handling, parent notification via Effect, or state resets
  in Effects. Also triggers on "why is my effect running twice", "useEffect dependency
  array", "effect cleanup", or any component pasted that contains useEffect. When in
  doubt, consult this skill — most useEffects in application code are unnecessary.
---

# You Might Not Need an Effect

Effects are an **escape hatch** for syncing with things *outside* React (browser APIs, third-party widgets, network). If no external system is involved, you probably don't need one.

> **This project uses React Compiler.** Expensive calculations are memoized automatically — never add `useMemo` manually. The patterns below reflect this.

Full before/after code for every rule below lives in `references/`, one file per rule — read the relevant file when you need the actual snippet, not just the rule.

---

## Quick Decision

```
Does this code need to run...

Because the component was DISPLAYED?  →  Effect (or useSyncExternalStore)
Because of a specific USER ACTION?     →  Event handler
Can it be calculated from props/state? →  Just calculate it at render time
Does it reset state when a prop changes? → Use the `key` prop
```

---

## Anti-Patterns and Their Fixes

### 1. Derived state in an Effect

**Rule:** If you can compute something from existing props or state, do it directly — no state, no Effect. See [references/01-derived-state.md](references/01-derived-state.md).

---

### 2. Caching an expensive calculation

**Rule:** Don't hold a derived value in state synced via an Effect. Calculate it inline at render time — React Compiler memoizes the expensive call for you, so there's no manual `useMemo` step either. See [references/02-expensive-calculation.md](references/02-expensive-calculation.md).

---

### 3. State reset when a prop changes

**Rule:** When you need to wipe *all* state for a new prop value, pass `key`. React destroys and recreates the subtree instead of patching it via an Effect. See [references/03-state-reset-on-prop-change.md](references/03-state-reset-on-prop-change.md).

---

### 4. Adjusting *some* state when a prop changes

**Rule:** Prefer storing only the ID and deriving the value at render time over patching state in an Effect. Only fall back to updating state during render (calling `setState` outside an event handler, guarded by a comparison) when the ID approach doesn't fit. See [references/04-adjusting-some-state.md](references/04-adjusting-some-state.md).

---

### 5. Sharing logic between event handlers

**Rule:** Effects run because a component was *displayed*, not because of a click. If logic should only run as a result of a user action, extract it into a plain function and call that function from every event handler that needs it — don't reach for an Effect just because multiple handlers need the same behavior. See [references/05-sharing-logic-between-handlers.md](references/05-sharing-logic-between-handlers.md).

---

### 6. POST requests

**Rule:** A user-triggered POST belongs in the event handler that triggered it. An Effect is only correct for things that should fire because the component appeared (e.g. a page-view analytics ping) — don't launder a click into an Effect by routing it through state. See [references/06-post-requests.md](references/06-post-requests.md).

---

### 7. Chains of Effects

**Rule:** If one Effect's `setState` exists only to trigger another Effect, flatten the whole chain into a single event handler that computes every resulting value in one pass. See [references/07-chains-of-effects.md](references/07-chains-of-effects.md).

---

### 8. App initialization

**Rule:** Logic that must run exactly once for the lifetime of the app (not the component) belongs at module scope, before React renders — not in a mount Effect, which Strict Mode runs twice in development. If the logic must live inside a component, guard it with a module-level flag instead. See [references/08-app-initialization.md](references/08-app-initialization.md).

---

### 9. Notifying a parent component

**Rule:** Don't use an Effect to mirror local state changes up to a parent — update local state and call the parent's callback in the same handler. If the component doesn't need its own state at all, make it fully controlled by the parent instead. See [references/09-notifying-parent.md](references/09-notifying-parent.md).

---

### 10. Passing data up to the parent

**Rule:** If a child fetches data only to hand it to its parent via an Effect, that's an extra render round-trip for nothing — let the parent fetch and pass the data down as a prop instead. See [references/10-passing-data-up.md](references/10-passing-data-up.md).

---

## Patterns Where Effects ARE Correct

### 11. External store subscriptions

**Rule:** Don't hand-roll a browser/external-store subscription with `useEffect` + `addEventListener`. Use `useSyncExternalStore`, which guarantees a consistent snapshot during concurrent rendering. See [references/11-external-store-subscriptions.md](references/11-external-store-subscriptions.md).

---

### 12. Data fetching

**Rule:** Fetching in response to a component being displayed (e.g. search results for the current query) is a correct use of Effects — but always add an `ignore` cleanup flag to avoid race conditions where a stale response overwrites a newer one. Extract to a custom hook (`useData(url)`) once the pattern repeats. See [references/12-data-fetching.md](references/12-data-fetching.md).

---

## Summary Table

| Situation | Fix |
|---|---|
| Value derived from props/state | Calculate at render time |
| Expensive derived value | Calculate at render time — React Compiler memoizes it |
| Reset all state on prop change | `key` prop |
| Reset some state on prop change | Store the ID, derive value at render |
| Logic shared by multiple event handlers | Extract a plain function, call it from each handler |
| POST on user action | Event handler |
| Multiple chained Effects | Flatten into one event handler |
| One-time app initialization | Module scope (or a module-level guard) |
| Notifying parent of state change | Update both in same handler, or lift state / make controlled |
| Child handing fetched data to parent | Parent fetches, passes data down as a prop |
| Subscription to browser/external store | `useSyncExternalStore` |
| Data fetching | Effect + `ignore` cleanup flag |
