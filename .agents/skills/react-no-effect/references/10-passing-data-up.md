# 10. Passing data up to the parent

```tsx
// ❌ Child fetches, then uses an Effect just to hand the result to the parent —
// an extra render round-trip for no reason
function Child({ onFetched }) {
  const data = useSomeAPI();
  useEffect(() => {
    if (data) {
      onFetched(data);
    }
  }, [onFetched, data]);
}

// ✅ Let the parent own the fetch and pass data down as a prop
function Parent() {
  const data = useSomeAPI();
  return <Child data={data} />;
}

function Child({ data }) {
  // ...
}
```
