# 1. Derived state in an Effect

```tsx
// ❌ Two render passes, stale intermediate state
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(firstName + ' ' + lastName);
}, [firstName, lastName]);

// ✅ Calculate at render time
const fullName = firstName + ' ' + lastName;
```
