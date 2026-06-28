# 6. POST requests

```tsx
// ❌ Analytics vs form submission look the same but are different —
// this one is user-triggered and shouldn't be hidden behind an Effect + extra state
const [jsonToSubmit, setJsonToSubmit] = useState(null);
useEffect(() => {
  if (jsonToSubmit !== null) {
    post('/api/register', jsonToSubmit);
  }
}, [jsonToSubmit]);

function handleSubmit(e) {
  e.preventDefault();
  setJsonToSubmit({ firstName, lastName });
}

// ✅ Analytics (runs because the component appeared) → Effect is correct
useEffect(() => {
  post('/analytics/event', { eventName: 'visit_form' });
}, []);

// ✅ Form submission (user triggered) → straight to an event handler
function handleSubmit(e) {
  e.preventDefault();
  post('/api/register', { firstName, lastName });
}
```
