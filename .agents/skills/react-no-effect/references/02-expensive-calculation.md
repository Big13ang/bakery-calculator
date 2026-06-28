# 2. Caching an expensive calculation

The article's fix here is `useMemo`. **This project runs React Compiler, which memoizes expensive calculations for you** — so the fix is even simpler: just calculate the value inline, with no Effect, no state, and no manual `useMemo`.

```tsx
// ❌ State + Effect just to hold a derived value
const [visibleTodos, setVisibleTodos] = useState([]);
useEffect(() => {
  setVisibleTodos(getFilteredTodos(todos, filter));
}, [todos, filter]);

// ✅ Calculate at render time — React Compiler memoizes the expensive call automatically
const visibleTodos = getFilteredTodos(todos, filter);
```
