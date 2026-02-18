# 🚀 Expo Best Practices Guide

## 1) Understand the two-thread model (most important)

Expo apps run on:

* **JavaScript thread** → business logic, React rendering
* **UI thread (native)** → animations, gestures, layout

👉 If JS thread is blocked → UI freezes or stutters.

### ✅ Best practices

* Keep heavy work **off the JS thread**
* Avoid synchronous expensive loops during interaction
* Move animation logic to native/Worklets when possible

Using native-driven animation tools keeps UI smooth even when JS is busy.

Expo guidance also emphasizes optimizing JavaScript and profiling performance to reduce lag and keep rendering smooth. ([Expo][1])

---

## 2) Use Worklets / native-driven animations for smooth UI

Animations executed in JS cause frame drops.

### ✅ Prefer

* **Reanimated worklets**
* Native gesture handling
* Native transitions

### ❌ Avoid

* JS-based animation loops
* setInterval animation updates
* heavy state updates during animations

**Rule:**
👉 Anything tied to frame updates → run on native thread.

---

## 3) Reduce unnecessary React re-renders

Many Expo performance issues come from React patterns.

### ✅ Do

* Memoize components (`React.memo`)
* Memoize callbacks (`useCallback`)
* Memoize expensive calculations (`useMemo`)
* Split big components into smaller ones

### ❌ Avoid

* Inline anonymous functions in lists
* Passing new object literals as props every render
* Global state updates triggering whole-tree rerenders

This aligns with common React Native performance fixes where improper rendering patterns degrade FPS and responsiveness. ([Medium][2])

---

## 4) Profile first — never guess performance problems

The video stresses debugging before optimizing.

### Tools to use

* Expo performance monitor
* React DevTools profiler
* Native performance inspector
* Chrome debugging tools

### Workflow

1. Detect slow interaction
2. Check JS frame drops
3. Identify re-render sources
4. Move heavy logic or optimize

**Golden rule:**
👉 Measure → diagnose → fix → re-measure

---

## 5) Keep screens lightweight during navigation

Slow navigation happens when a screen does too much on mount.

### ✅ Fix by

* Lazy-loading heavy components
* Deferring work until after animation
* Fetching data asynchronously
* Showing skeleton/loading UI first

### Example strategy

* Navigate immediately
* Load expensive content after screen transition completes

---

## 6) Optimize lists aggressively

Large lists are the #1 real-world Expo bottleneck.

### ✅ Always use

* `FlatList` instead of `ScrollView`
* Proper `keyExtractor`
* `getItemLayout` if height known
* Small `initialNumToRender`
* Memoized item renderer

### ❌ Avoid

* Rendering full arrays in JSX
* Heavy list item components
* Inline render functions

---

## 7) Manage images and assets properly

Images can crash performance on low-memory devices.

### ✅ Best practices

* Resize images server-side
* Use compressed formats
* Cache images
* Avoid loading full-resolution images in lists

---

## 8) Avoid blocking JS thread with logs & debug code

Production apps often suffer from leftover dev code.

### ✅ Remove

* excessive `console.log`
* debug overlays
* unused dev libraries

Even simple logs can block the JS thread and introduce lag in production apps. ([Medium][2])

---

## 9) Prefer Expo-native ecosystem tools

Stay within Expo’s optimized stack when possible.

### Good choices

* Expo Router
* Expo Image
* Expo Gesture Handler
* Expo Reanimated

These are tuned for Expo runtime and avoid unnecessary bridging overhead.

---

# 🧠 Simple mental model for Expo performance

### 🟢 Smooth apps

* Native handles animation
* JS handles logic
* Components render minimally
* Lists virtualized
* Assets optimized

### 🔴 Slow apps

* JS handles animation
* Heavy rendering during transitions
* Large unoptimized images
* Massive global state updates
* Too many rerenders

---

# ✅ Expo performance checklist (copy into your project)

**Before shipping:**

* [ ] No unnecessary re-renders
* [ ] Animations run on native/worklets
* [ ] Lists virtualized and memoized
* [ ] Images compressed & resized
* [ ] Navigation screens lazy-load heavy parts
* [ ] Debug logs removed
* [ ] Performance profiled on real device