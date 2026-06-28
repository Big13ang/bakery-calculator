# 12. Data fetching (an Effect IS correct here — add cleanup)

```tsx
// ❌ No protection against race conditions — a slow response for an old query can overwrite a newer one
useEffect(() => {
  fetchResults(query, page).then(json => {
    setResults(json);
  });
}, [query, page]);

// ✅ Add an `ignore` cleanup flag
useEffect(() => {
  let ignore = false;

  fetchResults(query, page).then(json => {
    if (!ignore) setResults(json);
  });

  return () => { ignore = true; };
}, [query, page]);

// ✅✅ Best: extract the repeated pattern into a custom hook
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let ignore = false;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        if (!ignore) setData(json);
      });
    return () => { ignore = true; };
  }, [url]);
  return data;
}
```
