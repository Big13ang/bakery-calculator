# 3. State reset when a prop changes

```tsx
// ❌ Children render once with stale state, then again after the Effect
useEffect(() => {
  setComment('');
}, [userId]);

// ✅ Tell React this is a different component instance
<Profile key={userId} userId={userId} />
// Profile's state resets automatically when key changes
```
