# 4. Adjusting *some* state when a prop changes

```tsx
// ❌ Extra render with stale selection
useEffect(() => {
  setSelection(null);
}, [items]);

// ✅ Option A (best): store only the ID, derive selection during render
const selection = items.find(item => item.id === selectedId) ?? null;

// ✅ Option B: update state during render (unusual but valid — only when Option A doesn't fit)
const [prevItems, setPrevItems] = useState(items);
if (items !== prevItems) {
  setPrevItems(items);
  setSelection(null);
}
```
