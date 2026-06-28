# 8. App initialization

```tsx
// ❌ Runs twice in Strict Mode dev, and on every remount
useEffect(() => {
  loadDataFromLocalStorage();
  checkAuthToken();
}, []);

// ✅ Option A: a module-level guard, if the logic needs to live inside the component
let didInit = false;

function App() {
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      loadDataFromLocalStorage();
      checkAuthToken();
    }
  }, []);
}

// ✅ Option B (preferred when possible): run at module load, before React renders at all
if (typeof window !== 'undefined') {
  checkAuthToken();
  loadDataFromLocalStorage();
}

function App() { /* ... */ }
```
