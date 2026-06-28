# 11. External store subscriptions

```tsx
// ❌ Effect-based subscription (works but fragile — no consistent snapshot during concurrent rendering)
useEffect(() => {
  function updateState() {
    setIsOnline(navigator.onLine);
  }
  updateState();
  window.addEventListener('online', updateState);
  window.addEventListener('offline', updateState);
  return () => {
    window.removeEventListener('online', updateState);
    window.removeEventListener('offline', updateState);
  };
}, []);

// ✅ useSyncExternalStore
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true, // server snapshot
  );
}
```
