# 9. Notifying a parent component

```tsx
// ❌ Parent re-renders one tick after the child already re-rendered
useEffect(() => {
  onChange(isOn);
}, [isOn, onChange]);

// ✅ Update both in the same handler that changes the state
function updateToggle(nextIsOn) {
  setIsOn(nextIsOn);
  onChange(nextIsOn);
}

function handleClick() {
  updateToggle(!isOn);
}

// ✅✅ Or skip local state entirely and make the component fully controlled
function Toggle({ isOn, onChange }) {
  return <button onClick={() => onChange(!isOn)}>{isOn ? 'On' : 'Off'}</button>;
}
```
