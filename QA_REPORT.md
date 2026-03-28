# QA Report: Kids Time Explorer

**Initial QA Date:** 2026-03-26
**Verification Date (Round 2):** 2026-03-27
**Verification Date (Round 3):** 2026-03-27
**Verification Date (Round 4):** 2026-03-27
**Verification Date (Round 5):** 2026-03-27
**Verification Date (Round 6):** 2026-03-27
**Verification Date (Round 7 — A11Y-5 fix):** 2026-03-27
**Verification Date (Round 8 — Timer Mode + Refactor Regression):** 2026-03-27
**Verification Date (Round 9 — BUG-1 + A11Y-4 + Orientation Lock Fixes):** 2026-03-27
**Verification Date (Round 10 — Speak Time Feature QA):** 2026-03-27
**Verification Date (Round 11 — BUG-10-A/B/C Fix Verification):** 2026-03-27
**Verification Date (Round 12 — Location Display & Reverse Geocoding QA):** 2026-03-27
**Verification Date (Round 13 — PWA Native-Feel + Timer Alarm + A11Y Regression):** 2026-03-27
**Verification Date (Round 14 — BUG-13-A/B/C Fix Verification):** 2026-03-27
**Verification Date (Round 15 — Timer 24:00:00 + Text Selection Disable):** 2026-03-28
**URL:** https://kids-time-explorer-605626490127.us-west1.run.app/
**Tested on:** Desktop (1280x800), Mobile Portrait (390x844), Mobile Landscape (667x375 and 844x390), Tablet Portrait (768x1024), Tablet Landscape (1024x768)
**Tools used:** dev-browser (headless Playwright), Chrome DevTools CDP (live browser)

---

## Current Status

### Open Items (Round 15)

| Priority | Item | Description |
|----------|------|-------------|
| Won't Fix | UX-2 | SW doesn't cache audio/weather — platform-managed, outside app scope |

**No actionable open items remain.**

---

### Lighthouse Score History

| Round | Accessibility | Best Practices | Notes |
|-------|--------------|----------------|-------|
| Round 1 | 88 | 88 | Baseline — 2 contrast failures, missing aria-labels, no h1 |
| Round 2 | 95 | 88 | BUG-1 through BUG-6 fixed; A11Y-0 partial |
| Round 3 | 95 | 92 | A11Y-0 (Night Time + Clear) fixed; BUG-5, BUG-6 fixes |
| Round 4 | 96 | 92 | A11Y-1, A11Y-2, A11Y-3 fixed; AM/PM contrast fixed |
| Round 5 | 96 | 96 | A11Y-4 fix (sr-only peer) |
| Round 6 | 100 | 96 | A11Y-5 partial fix — label row contrast introduced |
| Round 7 | 100 | 96 | A11Y-5 complete fix (label contrast); Lighthouse 100/100 restored |
| Round 8 | 100 | 96 | Refactor regression — A11Y-4 re-broken (display:none), but not caught by Lighthouse |
| Round 9 | 100 | 96 | BUG-1 + A11Y-4 fixed; all regressions resolved |
| Round 10 | 100 | 96 | Speak Time feature QA — 3 new bugs found; no Lighthouse regression |
| Round 11 | 100 | 96 | BUG-10-A/B/C fixes verified; all 3 bugs confirmed resolved |
| Round 12 | 100 | 96 | Location display & reverse geocoding QA — all 20 tests PASS |
| Round 13 | 88 | 96 | BUG-13-A (meta-viewport) + BUG-13-C (label contrast) caused regression |
| Round 14 | 100 | 96 | BUG-13-A/B/C + BUG-14-A/B fixed; Lighthouse 100/100 restored |
| Round 15 | 100 | 96 | Timer 24:00:00 + text selection disable — all 17 tests PASS; no new bugs |

**Note:** Best Practices 96/100 is a pre-existing non-critical issue — geolocation requested on page load. Won't Fix.

---

### Round-by-Round Summary

- **Round 1:** Discovery. Full functional sweep + CDP audit. Found BUG-1 through BUG-6, A11Y-0 through A11Y-4, UX-1 through UX-4. Lighthouse 88/100.
- **Round 2:** Fixed all Round 1 bugs. A11Y-0 partially resolved (2 of 3 contrast failures). Cricket autoplay console error found (new).
- **Round 3:** Fixed remaining A11Y-0 contrast failures (Night Time, Clear). New: AM/PM button contrast surfaced (was masked). Fixed cricket autoplay.
- **Round 4:** Fixed AM/PM button contrast — Lighthouse 100/100. Gap coverage via CDP advanced techniques: geolocation, weather, thunderstorm button, audio pipeline all verified for first time.
- **Round 5:** Help overlay + PWA PNG icon upgrade verified. Lighthouse 100/100.
- **Round 6:** Color swap, Alternate Mode, Full Seconds Circle, second hand accuracy, rooster direction guard all verified. A11Y-5 found — 3 new contrast failures in digital clock label row.
- **Round 7:** A11Y-5 fixed — label classes updated to solid darker variants. Lighthouse 100/100 restored.
- **Round 8:** Major refactor (monolithic `page.tsx` → 7 components + 3 hooks) + Timer Mode tested. 2 regressions found: BUG-1 (AM/PM toggle) and A11Y-4 (Toggle.tsx `hidden` class). All 15 Timer Mode tests PASS.
- **Round 9:** BUG-1 and A11Y-4 regressions fixed and verified. Orientation lock overlays re-verified on both phone landscape and tablet portrait. Lighthouse 100/100.
- **Round 10:** Speak Time feature QA. 3 new bugs found: BUG-10-A (language dropdown no dismiss/missing ARIA), BUG-10-B (British o'clock missing time-of-day period), BUG-10-C (en-GB voice falls back to en-US).
- **Round 11:** BUG-10-A/B/C all fixed and verified. All 19 tests PASS.
- **Round 12:** Location display & reverse geocoding QA. Uniform 48px top-bar heights, city truncation, Nominatim `City, CC` format all verified. All 20 tests PASS.
- **Round 13:** PWA native-feel enhancements (viewport-fit=cover, safe-area insets, theme-color sync) verified. Timer alarm logic correct. Regressions found: BUG-13-A (meta-viewport blocks zoom) and BUG-13-C (label contrast at night). Lighthouse 88/100.
- **Round 14:** BUG-13-A/B/C fixed. Two new bugs found during verification: BUG-14-A (hour digit contrast at night) and BUG-14-B (language button label mismatch). Both fixed. Lighthouse 100/100 restored.
- **Round 15:** Two new features verified on deployed app. Text selection disabled globally. Timer max extended to 24:00:00 — display guard in `DigitalClock.tsx` + delta arithmetic fix in `useTimer.ts:handleTimerChange`. All 17 tests PASS. Zero JS errors.

---

## Verification Summary

### Era 1 — Items Introduced in Rounds 1–6

| Item | Round 1 | Round 2 | Round 3 | Round 4 | Round 5 | Round 6 |
|------|---------|---------|---------|---------|---------|---------|
| BUG-1: AM/PM toggle date jump | FAIL | **FIXED** | **FIXED** | **FIXED** | **FIXED** | **FIXED** |
| BUG-2: Sync to Now button missing | FAIL | **FIXED** | **FIXED** | **FIXED** | **FIXED** | **FIXED** |
| BUG-3: Transition sounds muted | FAIL | **FIXED** | **FIXED** | **FIXED** | **FIXED** | **FIXED** |
| BUG-4: No "time traveled" label | FAIL | **FIXED** | **FIXED** | **FIXED** | **FIXED** | **FIXED** |
| BUG-5: Large phone orientation lock | FAIL | **FIXED** | **FIXED** | **FIXED** | **FIXED** | **FIXED** |
| BUG-6: favicon.ico 404 | FAIL | **FIXED** | **FIXED** | **FIXED** | **FIXED** | **FIXED** |
| A11Y-0: Color contrast (3 failures) | FAIL | **PARTIAL** | **FIXED** (2/3 + new AM/PM) | **FIXED** (Lighthouse 100/100) | **FIXED** | **FIXED** |
| A11Y-1: Buttons missing aria-label | FAIL | **FIXED** | **FIXED** | **FIXED** | **FIXED** | **FIXED** |
| A11Y-2: Missing h1 | FAIL | **FIXED** | **FIXED** | **FIXED** | **FIXED** | **FIXED** |
| A11Y-3: SVG not aria-hidden | FAIL | **FIXED** | **FIXED** | **FIXED** | **FIXED** | **FIXED** |
| A11Y-4: Toggles missing role=switch | FAIL | **FIXED** | **FIXED** | **FIXED** | **FIXED** | **FIXED** |
| A11Y-5: Digital clock label row contrast | — | — | — | — | — | **FAIL** → **FIXED** (Round 7) |
| UX-1: PWA placeholder icons | FAIL | **FIXED** | **FIXED** | **FIXED** | **FIXED** | **FIXED** |
| UX-2: SW not caching audio/weather | PARTIAL | STILL OPEN | **WON'T FIX** | **WON'T FIX** | **WON'T FIX** | **WON'T FIX** |
| UX-3: No paused indicator | FAIL | **FIXED** | **FIXED** | **FIXED** | **FIXED** | **FIXED** |
| UX-4: bg-black on main | FAIL | **FIXED** | **FIXED** | **FIXED** | **FIXED** | **FIXED** |
| Cricket autoplay console error | — | **OPEN** | **FIXED** | **FIXED** | **FIXED** | **FIXED** |
| GAP: Geolocation + weather | NOT TESTED | NOT TESTED | NOT TESTED | **PASS** | **PASS** | **PASS** |
| GAP: Thunderstorm button | NOT TESTED | NOT TESTED | NOT TESTED | **PASS** | **PASS** | **PASS** |
| GAP: Audio pipeline (ambient, transitions, mute) | NOT TESTED | NOT TESTED | NOT TESTED | **PASS** | **PASS** | **PASS** |
| NEW: Help button + overlay | — | — | — | — | **PASS** | **PASS** |
| NEW: PWA PNG icons (192, 512, apple-touch) | — | — | — | — | **PASS** | **PASS** |
| NEW: Alternate Mode (00-60) | — | — | — | — | NOT TESTED | **PASS** |
| NEW: Full Seconds Circle toggle | — | — | — | — | NOT TESTED | **PASS** |
| NEW: Clock color swap (hand/number colors) | — | — | — | — | NOT TESTED | **PASS** |
| FIX: Second hand accuracy at 0s | — | — | — | — | NOT TESTED | **PASS** |
| FIX: Rooster direction guard | — | — | — | — | NOT TESTED | **PASS** |

### Era 2 — Items Introduced in Rounds 7–15

| Item | Introduced | Status |
|------|-----------|--------|
| BUG-1 regression (Round 8 refactor) | Round 8 | **FIXED** (Round 9) |
| A11Y-4 regression (Round 8 refactor) | Round 8 | **FIXED** (Round 9) |
| BUG-10-A: Language dropdown no dismiss + missing ARIA | Round 10 | **FIXED** (Round 11) |
| BUG-10-B: British o'clock missing time-of-day phrase | Round 10 | **FIXED** (Round 11) |
| BUG-10-C: en-GB voice falls back to en-US | Round 10 | **FIXED** (Round 11) |
| NEW: Speak Time feature (en-US, en-GB, id-ID) | Round 10 | **PASS** |
| NEW: Location display — uniform 48px top bar | Round 12 | **PASS** |
| NEW: Reverse geocoding — Nominatim City, CC format | Round 12 | **PASS** |
| NEW: PWA viewport-fit=cover + safe-area insets | Round 13 | **PASS** |
| NEW: theme-color meta syncs day/night | Round 13 | **PASS** |
| NEW: body backgroundColor syncs day/night | Round 13 | **PASS** |
| NEW: overscroll-behavior: none | Round 13 | **PASS** |
| NEW: Timer alarm logic (remaining===0) | Round 13 | **PASS** |
| BUG-13-A: meta-viewport blocks zoom | Round 13 | **FIXED** (Round 14) |
| BUG-13-B: Timer alarm silent on iOS after inactivity | Round 13 | **FIXED** (Round 14) |
| BUG-13-C: Label contrast regression at night | Round 13 | **FIXED** (Round 14) |
| BUG-14-A: Hour digit contrast fails at night | Round 14 | **FIXED** (Round 14) |
| BUG-14-B: Language button label-content-name-mismatch | Round 14 | **FIXED** (Round 14) |
| NEW: Text selection disabled (user-select + touch-callout) | Round 15 | **PASS** |
| NEW: Timer max 24:00:00 — display guard in DigitalClock | Round 15 | **PASS** |
| NEW: Timer max 24:00:00 — increment/decrement at boundary | Round 15 | **PASS** |
| NEW: Clock mode unaffected (23:59:59 → 00:00:00, date advances) | Round 15 | **PASS** |

---

## Methodology

### Overview

This QA process is fully automated — no manual browser interaction was performed. All testing was driven programmatically by an AI coding agent (OpenCode) using two MCP (Model Context Protocol) servers that expose browser control as tool calls. The agent plans tests, executes them sequentially, interprets results, and updates this report in a single session.

This approach is repeatable, documentable, and transferable to any web or mobile PWA project.

---

### Tools

#### dev-browser (headless Playwright via MCP)

A headless Chromium instance controlled through a Playwright-backed MCP server. The agent calls tools like `navigate`, `click`, `snapshot`, `evaluate_script`, and `take_screenshot` to drive functional test flows.

**Strengths:**
- Fast multi-step scripting in a single tool call block
- Fully sandboxed and isolated — no shared cookies or browser state
- DOM snapshots expose the full accessibility tree with element UIDs for precise interaction
- Good for functional sweeps: button flows, form interactions, layout verification

**Limitations:**
- No access to browser console messages
- No access to network request logs or response bodies
- No built-in Lighthouse auditing
- Viewport resize only — cannot set device pixel ratio, touch flag, or landscape flag for true mobile emulation
- Audio elements cannot play (no user gesture in headless context)

#### chrome-devtools (CDP via MCP)

A Chrome DevTools Protocol bridge that connects to a live Chrome instance running with remote debugging enabled (`--remote-debugging-port=9222`). Exposes console, network, performance, Lighthouse, device emulation, and JavaScript execution as MCP tools.

**Strengths:**
- Full console access — surfaces JS errors, warnings, and log output invisible to automation
- Network inspector with request/response headers and bodies — verifies API calls, status codes, caching
- Lighthouse audit built-in — accessibility scoring, contrast ratio failures, SEO, Best Practices
- Performance trace — LCP, CLS, TTFB, render-blocking resource analysis
- Full device emulation: viewport, DPR, touch flag, landscape flag, geolocation, network throttling
- `evaluate_script` runs arbitrary JS in the live page context — reads DOM state, audio element properties, React state via refs
- `initScript` injects JS before page load — enables fetch interception and API mocking

**Limitations:**
- Not sandboxed — operates on a real Chrome session with existing cookies and auth state
- One tool call per action (slower than Playwright multi-step scripts)
- Requires Chrome running with `--remote-debugging-port=9222` before session starts

---

### Tool Comparison

| Capability | dev-browser | chrome-devtools (CDP) |
|---|---|---|
| Navigate & click | Full Playwright API, easy scripting | Click by uid, works but more verbose |
| Screenshots | Save to file, view later | Inline in response, immediately visible |
| DOM snapshot | `snapshotForAI()` flat text tree | a11y tree with uids, good for interaction |
| JS execution | `page.evaluate()` — powerful, multi-step | `evaluate_script` — same power |
| **Console messages** | Not available | Full access — found SW log + favicon 404 |
| **Network requests** | Not available | Full list with headers, status, response body |
| **Lighthouse audit** | Not available | Built-in — found 3 color contrast failures |
| **Performance trace** | Not available | LCP/CLS/FCP insights, render-blocking analysis |
| **Device emulation** | Viewport resize only | Full emulation (DPR, touch flag, landscape flag) — found large-phone orientation bug |
| **Geolocation emulation** | Not available | `emulate(geolocation)` + `initScript` override — tested weather with SF and Tokyo coords |
| **Fetch interception** | Not available | `initScript` patches `window.fetch` before app mount — tested thunderstorm UI state |
| **Audio state inspection** | Not available | `evaluate_script` reads `currentTime`, `paused`, `muted` — verified rooster/cricket transitions |
| **`initScript` injection** | Not available | Runs JS before page load — enables geolocation + fetch mocking without code changes |
| Multi-step scripting | Single block, fast iteration | One tool call per action, slower |
| Sandboxed/isolated | Yes (headless Chromium) | No — uses real Chrome session with cookies |

**Verdict:** Use both tools together for comprehensive QA. dev-browser is faster for driving functional test flows; CDP is essential for diagnostics, auditing, and catching issues invisible to automation (console errors, contrast, network, performance, geolocation, fetch interception, audio pipeline).

**Issues found exclusively by CDP:** BUG-5 (large-phone orientation), BUG-6 (favicon 404), A11Y-0 (all contrast failures), A11Y-5 (digital label row contrast regression), cricket autoplay error, all Round 4 gap coverage, and Round 6 SVG DOM color/structure verification.

---

### Testing Workflow

This project used a **multi-round iterative QA cycle** (15 rounds to date):

```
Round 1: Discovery
  dev-browser  → functional test sweep (all UI features)
  CDP          → diagnostic audit (Lighthouse, console, network, performance trace)
  Output       → bug report with root causes and fixes

Round 2-3: Verification
  dev-browser  → re-run affected functional tests
  CDP          → re-run Lighthouse, check console clean, confirm DOM state
  Output       → updated report with FIXED / PARTIAL / STILL OPEN per item

Round 4: Gap Coverage + Final Verification
  CDP          → test previously untestable features using advanced techniques
  Output       → final report, zero open actionable items

Round 5+: Feature Additions + Verification
  dev-browser  → test new features
  CDP          → Lighthouse audit, console, network verification
  Output       → updated report with NEW items and verification
```

---

### Advanced Techniques (Round 4)

Three CDP-specific techniques enabled testing of features that were previously untestable:

#### 1. Geolocation Override via `initScript`

Chrome had permanently blocked the geolocation permission after repeated automated dismissals. The standard `emulate(geolocation: ...)` tool was insufficient because the permission was already denied at the browser level.

**Solution:** Use `navigate_page(initScript: ...)` to inject a script that runs before the app's JavaScript. The script overrides `navigator.geolocation.getCurrentPosition` with a function that immediately calls the success callback with synthetic coordinates:

```javascript
Object.defineProperty(navigator, 'geolocation', {
  value: {
    getCurrentPosition: (success) => {
      success({ coords: { latitude: 37.7749, longitude: -122.4194, accuracy: 10 } });
    }
  },
  configurable: true
});
```

This bypasses the browser permission system entirely and fires the app's geolocation callback before the mount effect runs, giving deterministic control over location.

#### 2. Fetch Interception via `initScript`

The thunderstorm button only appears when the weather API returns `weathercode >= 95`. Real weather is non-deterministic. To test this UI state, the Open-Meteo fetch was intercepted and replaced with a synthetic response:

```javascript
const _origFetch = window.fetch;
window.fetch = async (url, opts) => {
  if (typeof url === 'string' && url.includes('open-meteo.com')) {
    return new Response(JSON.stringify({
      current_weather: { temperature: 18.5, weathercode: 95, windspeed: 25, is_day: 1 },
      timezone: 'America/Los_Angeles'
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
  return _origFetch(url, opts);
};
```

Combined with geolocation override (so the fetch fires at all), this gave full control over weather state without any mocking framework or code changes in the app.

#### 3. Audio Pipeline Verification via `evaluate_script`

Browser autoplay policy prevents audio from playing without a prior user gesture. True audible output cannot be verified programmatically. Instead, `HTMLAudioElement` properties were read directly to confirm the audio pipeline was functional:

```javascript
const audio = document.querySelectorAll('audio')[0];
return { paused: audio.paused, currentTime: audio.currentTime, muted: audio.muted };
```

**Pattern used:**
1. Simulate a user gesture by clicking a page element (satisfies autoplay policy)
2. Read `currentTime` before and after a 2-second wait — if it advanced, audio is playing
3. For transition sounds (rooster/cricket): reset `currentTime` to 0, trigger the day/night boundary crossing via the time controls, then verify `currentTime > 0`
4. For mute/unmute: toggle the mute control and verify `paused` and `muted` properties toggle correctly

This provides strong confidence in the audio pipeline without requiring a human to listen.

---

### Applicability to Other Web/Mobile PWA Projects

This methodology generalizes to any web or mobile PWA. The key principles:

| Principle | Implementation |
|-----------|----------------|
| Use both tools together | dev-browser for functional flows, CDP for diagnostics — neither alone is sufficient |
| Audit early | Run Lighthouse in Round 1 to catch accessibility and contrast issues before they accumulate |
| Emulate real devices | CDP full device emulation (touch flag + landscape flag) catches bugs that viewport-only resize misses |
| Inspect the console | Every round — errors and warnings often surface bugs invisible to UI automation |
| Check the network | Verify API calls, response codes, third-party requests, and caching behavior |
| Use `initScript` for hard-to-reach states | Any feature gated on external API responses, permissions, or device capabilities can be unlocked with fetch interception or property overrides |
| Verify audio/video via element state | `currentTime`, `paused`, `muted`, `readyState` — not audible output |
| Document gaps explicitly | "NOT TESTED" rows in the test matrix are as important as PASS/FAIL — they drive the next round |

---

## Findings Reference

### Bugs

#### BUG-1: AM/PM Toggle Always Adds 12 Hours (Date Jumps Forward)

**Severity:** High
**Location:** `components/DigitalClock.tsx` — `toggleAmPm`
**Introduced:** Round 1 | **Fixed:** Round 2 | **Regressed:** Round 8 | **Re-fixed:** Round 9

**Steps to reproduce:**
1. Open the app at night (e.g., 11:00 PM)
2. Click the "PM" button to toggle AM/PM

**Expected:** Time changes from 11 PM to 11 AM on the same date.
**Actual:** Time changes to 11 AM on the next calendar day.

**Root cause:** `toggleAmPm` always adds 12 hours unconditionally. At hour 23 (11 PM), 23+12=35 → wraps to 11:00 the next day. The conditional subtract for PM→AM was lost during the Round 8 refactor.

**Fix applied:**
```typescript
const toggleAmPm = () => {
  onChangeTime((prev: number) => {
    const currentHour = new Date(prev).getHours();
    return currentHour >= 12
      ? prev - 12 * 3600000  // PM -> AM: subtract 12 hours
      : prev + 12 * 3600000; // AM -> PM: add 12 hours
  });
};
```

---

#### BUG-2: Sync to Now Button Never Appears After Manual Time Change

**Severity:** Medium
**Location:** `app/page.tsx` — `handleTimeChange`
**Introduced:** Round 1 | **Fixed:** Round 2

**Steps to reproduce:**
1. Change the time using the digital clock buttons
2. Look for the Sync to Now button (rotate icon) in the top-right corner

**Expected:** Sync to Now button appears when displayed time differs from real time.
**Actual:** Button never appears while the clock is paused after a manual change.

**Root cause:** `handleTimeChange` sets `time` directly and pauses the clock, but leaves `timeOffset` at 0. The Sync button renders only when `timeOffset !== 0`.

**Fix applied:** `handleTimeChange` now calculates and sets `timeOffset` immediately:
```typescript
const handleTimeChange = (newTime: number | ((prev: number) => number)) => {
  setIsPlaying(false);
  setTime(prev => {
    const nextTime = typeof newTime === 'function' ? newTime(prev) : newTime;
    const now = new Date();
    const tzDateStr = now.toLocaleString('en-US', {
      timeZone: timezone,
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', second: 'numeric',
      hour12: false
    });
    const tzDate = new Date(tzDateStr);
    const realTimeInTz = tzDate.getTime() + now.getMilliseconds();
    setTimeOffset(nextTime - realTimeInTz);
    return nextTime;
  });
};
```

---

#### BUG-3: Transition Sounds (Rooster/Cricket) Are Muted When Global Mute Is On

**Severity:** Medium
**Location:** `app/page.tsx` — `isMuted` effect
**Introduced:** Round 1 | **Fixed:** Round 2

**Description:** The code intent is for sunrise (rooster) and sunset (cricket) transition sounds to play regardless of the mute toggle. However, the `isMuted` effect explicitly muted the rooster and cricket audio refs:

```typescript
useEffect(() => {
  if (!audioRef.current) return;
  audioRef.current.muted = isMuted;
  if (roosterRef.current) roosterRef.current.muted = isMuted;  // bug
  if (cricketRef.current) cricketRef.current.muted = isMuted;  // bug
  ...
}, [isMuted, currentAudioUrl]);
```

**Fix applied:** Removed the two lines that mute the transition refs. Rooster and cricket always play audibly regardless of mute state.

---

#### BUG-4: Weather Condition Hidden When Date Is Not Today

**Severity:** Low
**Location:** `app/page.tsx` — `isCurrentDate` render branch
**Introduced:** Round 1 | **Fixed:** Round 2

**Description:** When the user navigates to a different date, the weather bar showed only the Day/Night indicator with no weather info and no explanatory message.

**Fix applied:** Added a "Time traveled" fallback label when `!isCurrentDate`:
```tsx
{isCurrentDate ? (
  <div className="flex items-center gap-2">
    <span className="text-sm sm:text-base font-black text-blue-600 capitalize">{weatherCondition}</span>
    {weatherData && <span className="text-sm sm:text-base font-bold text-slate-700">{weatherData.temperature}°C</span>}
  </div>
) : (
  <span className="text-sm font-bold text-slate-400 italic">Time traveled</span>
)}
```

---

#### BUG-5: Orientation Lock Fails on Large Phones in Landscape

**Severity:** Medium
**Location:** `app/page.tsx` — phone landscape media query
**Discovered via:** CDP full device emulation (touch flag + landscape flag)
**Introduced:** Round 1 | **Fixed:** Round 2

**Steps to reproduce:**
1. Open the app on an iPhone Pro Max (logical width ≥ 768px) in landscape orientation
2. App renders normally instead of showing the rotate message

**Root cause:** The media query `@media(max-width:767px) and (orientation:landscape)` does not trigger on large phones in landscape — e.g. iPhone 16 Pro Max landscape = 932px logical width.

**Fix applied:** New media query uses `hover:none`, `pointer:coarse`, and `max-height:500px` to target any touch phone in landscape regardless of width:
```tsx
<div className="fixed inset-0 z-[100] bg-slate-900 text-white flex-col items-center justify-center hidden [@media(hover:none)_and_(pointer:coarse)_and_(orientation:landscape)_and_(max-height:500px)]:flex">
```

---

#### BUG-6: favicon.ico Missing (404)

**Severity:** Low
**Location:** `app/layout.tsx` — icons declaration
**Discovered via:** CDP network inspector
**Introduced:** Round 1 | **Fixed:** Round 2

**Description:** The browser requests `/favicon.ico` automatically and received a 404, generating a console error on every page load.

**Fix applied:** `app/layout.tsx` now declares `icons: { icon: '/icon.svg' }`. No 404 on any round since Round 2.

---

#### BUG-10-B: British English o'clock Missing Time-of-Day Phrase

**Severity:** Medium
**Location:** `lib/timeToWords.ts:39`
**Introduced:** Round 10 | **Fixed:** Round 11

**Description:** At any exact hour (minutes === 0), British English omitted the time-of-day phrase:
- 3:00 → `"It's 3 o'clock"` (missing "in the morning")
- 15:00 → `"It's 3 o'clock"` (missing "in the afternoon")

**Root cause:** Line 39 returned `` `It's ${h12} o'clock` `` — `${period}` was computed above but not included.

**Fix applied:** `` return `It's ${h12} o'clock ${period}`; ``

---

#### BUG-10-C: en-GB Voice Falls Back to en-US Voice

**Severity:** Low
**Location:** `hooks/useSpeakTime.ts:29`
**Introduced:** Round 10 | **Fixed:** Round 11

**Description:** When language is set to `en-GB`, TTS used `Samantha (en-US)` instead of `Arthur (en-GB)`. The fallback `v.lang.startsWith(language.split('-')[0])` matched any `en-*` voice, and `Samantha` appeared first in the voice list.

**Fix applied:** 4-step priority voice search — exact match → hyphen-normalized exact → `startsWith(language)` → `startsWith(language.split('-')[0])`. `Arthur (en-GB)` now correctly matched for en-GB; no regressions for en-US or id-ID.

---

#### BUG-13-B: Timer Alarm May Not Sound on iOS After Extended Inactivity

**Severity:** Medium (intermittent, platform-dependent)
**Location:** `hooks/useTimer.ts`, `app/page.tsx` — `playAlarmSound`
**Introduced:** Round 13 | **Fixed:** Round 14

**Description:** Timer logic fires `remaining === 0` correctly under all conditions (verified with 5s block simulation and Date.now mock). However, after ~5 minutes of no user interaction, iOS Safari may revoke the autoplay gesture permission, causing `alarmRef.current.play()` to fail silently. Additionally, alarm audio loaded from an external CDN with no `preload` strategy.

**Fix applied (four mitigations):**
1. Web Audio API fallback: `playFallbackBeep` oscillator via `AudioContext` — unlocked on first user interaction, does not require re-gesture
2. `preload="auto"` on alarm `<audio>` element
3. `visibilitychange` handler in `useTimer.ts` — checks remaining time on tab resume and triggers alarm if expired
4. `navigator.vibrate([200, 100, 200, 100, 200])` as tactile fallback on supported mobile devices

---

#### Cricket Autoplay Console Error on Page Load

**Severity:** Low
**Location:** `app/page.tsx` — `prevIsDay` ref
**Discovered:** Round 2 | **Fixed:** Round 3

**Description:** On every page load at night, the cricket audio immediately attempted to play, generating a console error:
```
Cricket play blocked NotAllowedError: play() failed because the user didn't interact with the document first.
```

**Root cause:** The `prevIsDay` ref was initialized as `null`. On first render, when `isDay` evaluates to `false` (nighttime), the `isDay` effect sees `prevIsDay.current (null) !== isDay (false)` and fires the cricket transition sound before any user interaction. The browser's autoplay policy blocks it.

**Fix applied:** Initialize `prevIsDay` to `isDay`'s actual value at mount time:
```typescript
// Before:
const prevIsDay = useRef<boolean | null>(null);

// After:
const prevIsDay = useRef<boolean | null>(isDay); // skip first-render trigger
```

---

### Accessibility Issues

#### A11Y-0: Color Contrast Failures

**Severity:** High
**Discovered via:** CDP Lighthouse audit (score: 88/100)
**Introduced:** Round 1 | **Fully fixed:** Round 4

| Element | Text Color | Background | Actual Ratio | Required | Fixed |
|---------|-----------|------------|-------------|----------|-------|
| "Local" location label | `#1d293d` (slate-800) | `#625f82` (white/30 over indigo) | 2.42:1 | 4.5:1 | Round 2 |
| Seconds digit (green) | `#00c950` (green-500) | `#e9e8ed` (white/90) | 1.83:1 | 3:1 | Round 2 |
| "Night Time" / "Day Time" label | `#f1f5f9` (slate-100) | `#787694` (white/40 over indigo) | 3.97:1 | 4.5:1 | Round 3 |
| "Clear" weather condition text | `#8ec5ff` (blue-300) | `#787694` (white/40 over indigo) | 2.41:1 | 4.5:1 | Round 3 |
| AM/PM button text | `#62748e` (slate-500) | `#f1f5f9` (slate-100) | 4.34:1 | 4.5:1 | Round 4 |

---

#### A11Y-1: Buttons Missing aria-label

**Severity:** High
**Location:** Multiple components — all icon-only buttons
**Introduced:** Round 1 | **Fixed:** Round 2

**Description:** Almost all buttons used only Lucide SVG icons with no accessible text. Screen readers could not identify what these buttons do.

**Fix applied:** `aria-label` added to all icon-only buttons: Settings, Play/Pause, Sync to current time, Increase/Decrease hour/minute/second, AM/PM, Previous day, Next day, Close settings.

---

#### A11Y-2: No `<h1>` on the Page

**Severity:** Low
**Introduced:** Round 1 | **Fixed:** Round 2

**Fix applied:**
```tsx
<h1 className="sr-only">Kids Time Explorer</h1>
```

---

#### A11Y-3: Analog Clock SVG Not aria-hidden

**Severity:** Medium
**Introduced:** Round 1 | **Fixed:** Round 2

**Description:** The SVG clock has no keyboard equivalent for dragging hands. Screen readers were announcing the number elements inside the SVG. Digital clock buttons serve as the accessible alternative.

**Fix applied:** `aria-hidden="true"` on the SVG element.

---

#### A11Y-4: Toggle Switches Missing `role="switch"` and `aria-checked`

**Severity:** Low
**Location:** `components/Toggle.tsx`
**Introduced:** Round 1 | **Fixed:** Round 2 | **Regressed:** Round 8 | **Re-fixed:** Round 9

**Description:** The Toggle component used a visually hidden checkbox that did not announce as a switch to screen readers. In the Round 8 refactor, `className="sr-only peer"` was replaced with `className="hidden"` — `display:none` removes the element from the a11y tree entirely regardless of ARIA roles.

**Fix applied:**
```tsx
<input
  type="checkbox"
  role="switch"
  aria-checked={checked}
  checked={checked}
  onChange={e => onChange(e.target.checked)}
  className="sr-only peer"
/>
```

---

#### A11Y-5: Digital Clock Label Row Contrast Failures

**Severity:** High
**Location:** `components/DigitalClock.tsx` — "Hours", "Minutes", "Seconds" label row
**Introduced:** Round 6 | **Fixed:** Round 7

**Description:** The color swap commit introduced a label row using `/70` opacity variants of the hand colors. Lighthouse detected 3 failures against the `bg-white/90` background:

| Element | Class (before) | Class (after) | Ratio (before) | Required |
|---------|---------------|--------------|---------------|----------|
| "Hours" label | `text-green-600/70` | `text-green-700` | 2.34:1 | 4.5:1 |
| "Minutes" label | `text-red-500/70` | `text-red-600` | 2.80:1 | 4.5:1 |
| "Seconds" label | `text-blue-500/70` | `text-blue-600` | 2.47:1 | 4.5:1 |

**Fix applied (commit `bee7db8`):** Solid darker variants without opacity. Lighthouse 100/100 restored.

---

#### BUG-13-A: meta-viewport Blocks Zoom

**Severity:** High (Lighthouse 100 → 88)
**Location:** `app/layout.tsx` — viewport export
**Introduced:** Round 13 | **Fixed:** Round 14

**Description:** `maximum-scale=1, user-scalable=no` was added alongside `viewport-fit=cover` for native-app feel, preventing low-vision users from zooming. The Lighthouse `meta-viewport` audit has weight=10 — the single largest accessibility deduction.

**Fix applied:** Removed `maximumScale: 1` and `userScalable: false`. `viewportFit: 'cover'` retained for safe-area inset support. Viewport confirmed as `width=device-width, initial-scale=1, viewport-fit=cover`.

---

#### BUG-13-C: Digital Label Contrast Regression at Night

**Severity:** Medium
**Location:** `components/DigitalClock.tsx` — label row
**Introduced:** Round 13 | **Fixed:** Round 14

**Description:** The A11Y-5 fix (Round 7) used `text-green-700`/`text-red-600`/`text-blue-600` which pass against the day-mode `bg-white/90` background. At night, the composite background (`#e9e8ed` from `bg-white/90` over dark indigo `#1e1b4b`) is effectively the same color but was causing Lighthouse to re-flag these when combined with BUG-13-A.

**Fix applied:** `DigitalClock` now accepts `isDay` prop and uses conditional classes:
- Day: `text-green-700` / `text-red-600` / `text-blue-600`
- Night: `text-green-800` / `text-red-700` / `text-blue-700`

All variants guarantee >5:1 contrast against `#e9e8ed`. Confirmed via `evaluate_script`.

---

#### BUG-14-A: Hour Digit Contrast Fails at Night

**Severity:** Medium
**Location:** `components/DigitalClock.tsx` — hour digit `colorClass`
**Introduced:** Round 14 (found during BUG-13-C verification) | **Fixed:** Round 14

**Description:** The hour digit used `text-green-600` in Tailwind v4 oklch, which renders as `#00a63e` — giving **2.64:1** against `#e9e8ed` at night, below the 3:1 large-text threshold (48px bold). `text-green-600` in Tailwind v4 is lighter than its Tailwind v3 hex equivalent due to the oklch color space.

**Fix applied:** Night hour digit changed to `text-green-700` (oklch `0.527 0.154 150.069` → ~`#15803d`) giving **4.12:1**. Red and blue digits already passed.

---

#### BUG-14-B: Language Button label-content-name-mismatch (WCAG 2.5.3)

**Severity:** Low
**Location:** `app/page.tsx` — language selector button
**Introduced:** Round 14 (found during verification) | **Fixed:** Round 14

**Description:** The button had `aria-label="Select language"` but displayed visible text "EN"/"UK"/"ID". WCAG 2.5.3 requires the accessible name to contain the visible label text so voice control users can activate it by speaking the visible text.

**Fix applied:** `aria-label` now includes the visible badge: `"EN - Select language"`, `"UK - Select language"`, or `"ID - Select language"`.

---

#### BUG-10-A: Language Dropdown — No Dismiss, Missing ARIA Attributes

**Severity:** Medium
**Location:** `app/page.tsx` — language dropdown button and panel
**Introduced:** Round 10 | **Fixed:** Round 11

**Symptoms:**
1. Dropdown stays open when user clicks anywhere outside it (no `mousedown` outside listener)
2. Escape key does not close the dropdown (no `keydown` handler)
3. `aria-expanded` missing on trigger button
4. `aria-haspopup="listbox"` missing on trigger button

**Fix applied:** `langMenuRef` + `useEffect` with `mousedown`/`keydown` listeners; `aria-expanded={showLangMenu}`, `aria-haspopup="listbox"` on trigger; `role="listbox"` on container; `role="option"` + `aria-selected` on each item. Escape closes. Click-outside closes.

---

### UI/UX Issues

#### UX-1: PWA Icons Are External Placeholder Images

**Severity:** Medium
**Location:** `public/manifest.json`
**Introduced:** Round 1 | **Fixed:** Round 2 (SVG), Round 5 (PNG upgrade)

**Description:** The PWA manifest used random placeholder images from `picsum.photos`. Round 2 replaced with a local `icon.svg`. Round 5 upgraded to proper PNG icons (`icon-192.png`, `icon-512.png`, `apple-touch-icon.png`) served locally with correct `sizes` and `type` declarations.

---

#### UX-2: Service Worker Caches App Shell Only

**Severity:** Medium
**Status:** WON'T FIX — platform constraint

**Description:** The service worker (`_service-worker.js`) is injected and managed by the AI Studio / Cloud Run hosting infrastructure, not by the app's source code. Audio assets (Mixkit CDN) and weather API calls (Open-Meteo) are not cached. The app partially fails offline — the UI shell loads but sounds and weather do not work. Custom caching strategies for these external resources are outside the scope of the app.

---

#### UX-3: No Visual Indicator That Clock Is Paused

**Severity:** Low
**Introduced:** Round 1 | **Fixed:** Round 2

**Description:** When paused, the only visual cue was the play/pause button icon — easy to miss for young children.

**Fix applied:** A "PAUSED" badge renders on the clock face (SVG `<text>` inside a pill `<rect>`) when `isPlaying` is false. Confirmed via CDP screenshot.

---

#### UX-4: `bg-black` on `<main>` Can Flash Through

**Severity:** Low
**Location:** `app/page.tsx` — `<main>` element
**Introduced:** Round 1 | **Fixed:** Round 2

**Description:** `bg-black` was hardcoded on the outermost `<main>`. The inner `<div>` applied the actual sky/night background. On wide screens or during the 1-second CSS transition, black could peek through at the edges.

**Fix applied:** `bg-black` removed from `<main>`. Confirmed `class="h-[100dvh] w-full flex justify-center overflow-hidden"` with no background color.

---

## Performance Results

| Metric | Round 1 | Round 2–15 | Assessment |
|--------|---------|-----------|------------|
| LCP | 397 ms | 397 ms | Good (< 2500ms threshold) |
| CLS | 0.00 | 0.00 | Perfect |
| TTFB | 218 ms | 218 ms | Acceptable |
| Render delay | 179 ms | 179 ms | Acceptable |
| Render-blocking resources | 1 (CSS bundle) | 1 (CSS bundle) | Est. 202ms FCP/LCP savings if inlined |
| Third-party impact | picsum.photos: 5.7kB | None | Resolved in Round 2 — all icons now served locally |
| Lighthouse Accessibility | 88/100 | See Score History | Multiple regressions and recoveries — see Score History |
| Lighthouse Best Practices | 88/100 | 96/100 | 1 non-critical failure: geolocation requested on page load (Won't Fix) |
| Lighthouse SEO | 100/100 | 100/100 | Pass — stable across all rounds |

**Note:** The CSS bundle is render-blocking but served from the service worker cache (near-zero download time on repeat visits). The 202ms savings estimate applies only to first-ever visits before the SW is active.

---

## Responsive Design Results

| Viewport | Tool | Result | Notes |
|----------|------|--------|-------|
| Desktop 1280x800 | Both | PASS | Full layout, clock centered, digital clock and weather side by side |
| Mobile Portrait 390x844 | Both | PASS | Clock, digital time, and date stack vertically and scale correctly |
| Mobile Landscape 667x375 | Both | PASS | Rotate message shown ("Please rotate your phone to portrait mode") |
| Mobile Landscape 844x390 | CDP | **PASS** (fixed Round 2) | Correctly shows rotate message — BUG-5 fix confirmed |
| Tablet Portrait 768x1024 | Both | PASS | Rotate message shown ("Please rotate your tablet to landscape mode") |
| Tablet Landscape 1024x768 | Both | PASS | Full layout renders correctly |

---

## Round-by-Round Test Results

---

### Rounds 1–6 — Functional Test Results

Rounds 1–6 used the dev-browser and CDP tools for iterative functional sweeps. The table below tracks all features tested across this era. For root cause analysis and fix details, see the Findings Reference section above.

| Feature | Tool | Round 1 | Round 2 | Round 3 | Round 4 | Round 5 | Round 6 |
|---------|------|---------|---------|---------|---------|---------|---------|
| Analog clock renders | Both | PASS | PASS | PASS | PASS | PASS | PASS |
| Analog clock hand dragging | CDP | PASS | PASS | PASS | PASS | PASS | PASS |
| Digital clock displays | Both | PASS | PASS | PASS | PASS | PASS | PASS |
| Hour increment (+) | Both | PASS | PASS | PASS | PASS | PASS | PASS |
| Hour decrement (-) | Both | PASS | PASS | PASS | PASS | PASS | PASS |
| Minute increment (+) | Both | PASS | PASS | PASS | PASS | PASS | PASS |
| Second increment (+) | Both | PASS | PASS | PASS | PASS | PASS | PASS |
| AM/PM toggle | Both | FAIL | **PASS** | PASS | PASS | PASS | PASS |
| Date display | Both | PASS | PASS | PASS | PASS | PASS | PASS |
| Date next day (+) | Both | PASS | PASS | PASS | PASS | PASS | PASS |
| Date previous day (-) | Both | PASS | PASS | PASS | PASS | PASS | PASS |
| "Time traveled" label | dev-browser | FAIL | **PASS** | PASS | PASS | PASS | PASS |
| Day background (sky blue) | Both | PASS | PASS | PASS | PASS | PASS | PASS |
| Night background (dark indigo) | Both | PASS | PASS | PASS | PASS | PASS | PASS |
| Day/night transition | Both | PASS | PASS | PASS | PASS | PASS | PASS |
| Paused indicator on clock | CDP | FAIL | **PASS** | PASS | PASS | PASS | PASS |
| Play/Pause button | Both | PASS | PASS | PASS | PASS | PASS | PASS |
| Auto-pause on time change | Both | PASS | PASS | PASS | PASS | PASS | PASS |
| Sync to Now button | Both | FAIL | **PASS** | PASS | PASS | PASS | PASS |
| Settings panel opens | Both | PASS | PASS | PASS | PASS | PASS | PASS |
| Settings close (X button) | Both | PASS | PASS | PASS | PASS | PASS | PASS |
| Mute/Unmute toggle | Both | PASS | PASS | PASS | PASS | PASS | PASS |
| Soundboard (6 buttons) | Both | PASS | PASS | PASS | PASS | PASS | PASS |
| 24-Hour Time toggle | Both | PASS | PASS | PASS | PASS | PASS | PASS |
| Show Seconds toggle | Both | PASS | PASS | PASS | PASS | PASS | PASS |
| Show Date toggle | Both | PASS | PASS | PASS | PASS | PASS | PASS |
| Transition sounds bypass mute | CDP | FAIL | **PASS** | PASS | PASS | PASS | PASS |
| Weather fallback (no geo) | Both | PASS | PASS | PASS | PASS | PASS | PASS |
| favicon.ico | CDP | FAIL | **PASS** | PASS | PASS | PASS | PASS |
| PWA manifest | Both | PASS | PASS | PASS | PASS | PASS | PASS |
| PWA icons | Both | FAIL | **PASS** | PASS | PASS | **PASS** (PNG) | PASS |
| Service worker | CDP | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL | PARTIAL |
| Mobile portrait layout | Both | PASS | PASS | PASS | PASS | PASS | PASS |
| Mobile landscape lock (small phones) | Both | PASS | PASS | PASS | PASS | PASS | PASS |
| Mobile landscape lock (large phones) | CDP | FAIL | **PASS** | PASS | PASS | PASS | PASS |
| Tablet portrait lock | Both | PASS | PASS | PASS | PASS | PASS | PASS |
| Button aria-labels | Both | FAIL | **PASS** | PASS | PASS | PASS | PASS |
| SVG aria-hidden | dev-browser | FAIL | **PASS** | PASS | PASS | PASS | PASS |
| Toggle role=switch | dev-browser | FAIL | **PASS** | PASS | PASS | PASS | PASS |
| h1 present | dev-browser | FAIL | **PASS** | PASS | PASS | PASS | PASS |
| Color contrast (Lighthouse) | CDP | FAIL | PARTIAL | PARTIAL | **PASS** | PASS | **FAIL** (A11Y-5) |
| Cricket autoplay on load | CDP | — | OPEN | **FIXED** | PASS | PASS | PASS |
| Geolocation + weather | CDP | NOT TESTED | NOT TESTED | NOT TESTED | **PASS** | PASS | PASS |
| Thunderstorm condition + button | CDP | NOT TESTED | NOT TESTED | NOT TESTED | **PASS** | PASS | PASS |
| Ambient audio plays | CDP | NOT TESTED | NOT TESTED | NOT TESTED | **PASS** | PASS | PASS |
| Rooster on 6AM crossing | CDP | NOT TESTED | NOT TESTED | NOT TESTED | **PASS** | PASS | PASS |
| Cricket on 6PM crossing | CDP | NOT TESTED | NOT TESTED | NOT TESTED | **PASS** | PASS | PASS |
| Mute/unmute audio cycle | CDP | NOT TESTED | NOT TESTED | NOT TESTED | **PASS** | PASS | PASS |
| Help button + overlay | CDP | — | — | — | — | **PASS** | PASS |
| PWA PNG icons (192, 512, apple-touch) | CDP | — | — | — | — | **PASS** | PASS |
| Alternate Mode (00-60) | CDP | — | — | — | — | NOT TESTED | **PASS** |
| Full Seconds Circle toggle | CDP | — | — | — | — | NOT TESTED | **PASS** |
| Clock color swap (hand/number colors) | CDP | — | — | — | — | NOT TESTED | **PASS** |
| Digital clock label row contrast | CDP | — | — | — | — | NOT TESTED | **FAIL** → FIXED R7 |
| Second hand accuracy at 0s | CDP | — | — | — | — | NOT TESTED | **PASS** |
| Rooster direction guard | CDP | — | — | — | — | NOT TESTED | **PASS** |
| Console errors | CDP | FAIL | OPEN | **PASS** | PASS | PASS | PASS |

---

### Round 7 — A11Y-5 Fix Verification

**Commit:** `bee7db8` — Digital clock label row contrast fix
**Tools used:** Chrome DevTools CDP (Lighthouse, `evaluate_script`)

| # | Test | Result | Evidence |
|---|------|--------|----------|
| V1 | Label classes in DOM | PASS | CDP `evaluate_script`: `text-green-700`, `text-red-600`, `text-blue-600` confirmed — no opacity suffix |
| V2 | Lighthouse Accessibility | PASS | CDP Lighthouse: **100/100** — A11Y-5 fully resolved |
| V3 | Console errors | PASS | 0 JS errors; same pre-existing geo/manifest warnings |

**Round 7 Summary:** 3 tests PASS. A11Y-5 confirmed fixed. Lighthouse 100/100 restored.

---

### Round 8 — Timer Mode + Refactor Regression Testing

**Commit:** `5d7d0ee` — Major refactor (monolithic `page.tsx` → 7 components + 3 hooks) + Timer Mode feature
**Tools used:** Chrome DevTools CDP (Lighthouse, JS evaluation, a11y tree inspection, audio state)

#### A. Refactoring Regression Tests

| # | Test | Result | Evidence |
|---|------|--------|----------|
| A1 | Analog clock renders — hand colors | PASS | CDP: hour `#22c55e`, minute `#ef4444`, second `#3b82f6` confirmed |
| A2 | Digital clock displays — tabular-nums | PASS | dev-browser: `tabular-nums` class present; HOURS/MINUTES/SECONDS labels render |
| A3 | Full Seconds Circle ON/OFF | PASS | CDP: 73 `<text>` elements in SVG with Full Seconds Circle ON |
| A4 | Alternate Mode display | PASS | CDP: decreased seconds to 0, display showed "60" with minute unchanged |
| A5 | AM/PM toggle (BUG-1 regression) | **REGRESSED** | CDP: toggling PM→AM advanced date from Fri Mar 27 to Sat Mar 28. `toggleAmPm` always adds 12h — fix lost in refactor |
| A6 | Settings panel — all 5 toggles present | PASS | CDP a11y: AUDIO, SOUNDBOARD, DISPLAY sections visible; 5 toggle labels rendered |
| A7 | Help overlay open/close | PASS | CDP: overlay rendered with Features/How to Use headings; Close button present |
| A8 | Date display + navigation | PASS | CDP: "Previous day" and "Next day" buttons present with aria-labels |
| A9 | Weather fallback | PASS | CDP: "Local" StaticText present |
| A10 | PAUSED indicator | PASS | CDP: "PAUSED" string present in analog clock SVG when paused |
| A11 | Sync to Now button | PASS | CDP: "Sync to current time" button appeared after hour adjustment |
| A12 | Button aria-labels | PASS | CDP: 12 buttons queried; 0 without aria-label |
| A13 | Toggle checkbox a11y (A11Y-4 regression) | **REGRESSED** | CDP: all 5 `[role="switch"]` have `className="hidden"` → `display:none` → removed from a11y tree |
| A14 | Console errors on load | PASS | CDP: zero JS errors; 3 pre-existing warnings |
| A15 | Digital clock label contrast | PASS | CDP: `text-green-700`, `text-red-600`, `text-blue-600` confirmed — no regression |

#### B. Timer Mode Tests

| # | Test | Result | Evidence |
|---|------|--------|----------|
| B1 | Mode switch to Timer | PASS | CDP: "Start timer" / "Reset timer" buttons appeared; clock paused |
| B2 | Timer digital display (initial) | PASS | CDP a11y: shows 00:00:00; no AM/PM button present |
| B3 | Timer increment controls | PASS | CDP: clicked "Increase second" 3× → display advanced to "03" |
| B4 | Timer start/pause — preserves remaining | PASS | CDP: started 10s timer → paused at ~7s → display held at "04" |
| B5 | Timer reset | PASS | CDP: clicked Reset → display returned to 00:00:00 |
| B6 | Timer countdown to zero | PASS | CDP: set 3s timer, started → reached 00:00:00 within expected interval |
| B7 | Alarm plays at zero | PASS | CDP: `audio[src*="995"]` had `paused:false`, `currentTime:3.5` |
| B8 | Alarm auto-stops at 15s | PASS | CDP: waited 16s → `audio[src*="995"]` `paused:true`, `currentTime:0` |
| B9 | Timer analog display ("TIMER" text) | PASS | CDP: SVG text query returned "TIMER" in analog clock face when timer value=0 |
| B10 | Settings hidden in Timer mode | PASS | CDP a11y: AUDIO, SOUNDBOARD, 24-Hour/ShowSeconds/ShowDate/AlternateMode absent |
| B11 | Full Seconds Circle visible in Timer mode | PASS | CDP a11y: "Full Seconds Circle" and Clock/Timer mode selector present |
| B12 | Location/weather/date hidden in Timer | PASS | CDP: no MapPin, no weather text, no date nav buttons in a11y tree |
| B13 | Audio muted in Timer mode | PASS | CDP: all ambient audio `paused:true`; alarm audio `muted:true` |
| B14 | Switch back to Clock mode | PASS | CDP a11y: Local, AM button, AUDIO/SOUNDBOARD, all 5 toggles, date nav restored |
| B15 | AM/PM hidden in Timer mode | PASS | CDP a11y: no AM/PM button in a11y tree |

#### C. Visual / Accessibility / Performance

| # | Test | Result | Evidence |
|---|------|--------|----------|
| C1 | Lighthouse accessibility | PASS | CDP Lighthouse: **100/100** — no regressions from refactor |
| C2 | Lighthouse Best Practices | PASS | CDP Lighthouse: **96/100** — same pre-existing geo permission issue |
| C3 | Hour hand color in 24h mode | PASS | CDP: hour 14 → stroke `#166534` (dark green); hour 11 → stroke `#22c55e` (bright green) |
| C4 | Console errors after mode switches | PASS | CDP: zero JS errors after Clock→Timer→Clock round trip |
| C5 | Network — no rogue third-party | PASS | CDP: 18 requests total; all app assets 200; `mixkit.co` pre-existing pattern |

**Round 8 Summary:** 35 tests. PASS: 31 | REGRESSED: 2 (A5 BUG-1, A13 A11Y-4). All 15 Timer Mode tests PASS. Both regressions fixed in commit `ab05255`, verified in Round 9.

---

### Round 9 — Fix Verification: BUG-1, A11Y-4, Orientation Locks

**Commit:** `ab05255` — `DigitalClock.tsx` (AM/PM conditional toggle), `Toggle.tsx` (sr-only peer), `page.tsx` (tablet portrait lock re-added)
**Tools used:** Chrome DevTools CDP (a11y snapshots, JS evaluation, device emulation)

| # | Test | Result | Evidence |
|---|------|--------|----------|
| V1 | BUG-1: AM→PM (11 AM → 11 PM) | PASS | CDP: hour stayed **11**, date stayed **Fri, Mar 27, 2026**, button changed to "PM" |
| V2 | BUG-1: PM→AM (11 PM → 11 AM) — critical regression case | PASS | CDP: hour stayed **11**, date stayed **Fri, Mar 27, 2026**. Date did NOT advance. |
| V3 | A11Y-4: Toggle checkboxes in a11y tree | PASS | CDP: 5 `switch` roles with correct `checked` states; all have `display: block`, `className: "sr-only peer"` |
| V4a | Phone landscape lock (844×390, touch, landscape) | PASS | CDP emulation: "Please rotate your phone to portrait mode." rendered |
| V4b | Tablet portrait lock (768×1024, touch, portrait) | PASS | CDP emulation: "Please rotate your tablet to landscape mode." rendered |
| V5 | Lighthouse accessibility | PASS | CDP Lighthouse: **100/100** |
| V6 | Console errors on load | PASS | CDP: zero JS errors; 3 pre-existing warnings |
| V7 | Timer Mode regression | PASS | CDP: Timer mode active; switch back to Clock restored all features |
| V8 | Analog clock hand colors | PASS | CDP: hour `#22c55e`, minute `#ef4444`, second `#3b82f6` confirmed |
| V9 | AM/PM edge case: 12 AM→PM (midnight→noon) | PASS | CDP: hour stayed **12**, date stayed Fri Mar 27, "Day Time" shown |
| V10 | AM/PM edge case: 12 PM→AM (noon→midnight) | PASS | CDP: hour stayed **12**, date stayed Fri Mar 27, "Night Time" shown |

**Round 9 Summary:** 11 tests. PASS: 11 | FAIL: 0. Both Round 8 regressions confirmed fixed. Lighthouse 100/100.

---

### Round 10 — Speak Time Feature QA

**Commit:** `81dd770` — Introduces `hooks/useSpeakTime.ts`, `lib/timeToWords.ts`, speak UI in `app/page.tsx`
**Tools used:** Chrome DevTools CDP (code review, JS evaluation, a11y snapshots, Lighthouse)

#### A. Speak Button UI & Timer Mode Isolation

| # | Test | Result | Evidence |
|---|------|--------|----------|
| A1 | Speak button visible in Clock mode | PASS | CDP screenshot: Volume2 icon + "EN" badge visible top-right |
| A2 | Speak button in a11y tree | PASS | CDP snapshot: `button "Speak current time"` present |
| A3 | Language dropdown button in a11y tree | PASS | CDP snapshot: `button "Select language"` present |
| A4 | Speak button hidden in Timer mode | PASS | CDP: speak widget unmounted in Timer mode |
| A5 | Language dropdown closes on mode switch | PASS | CDP: `document.querySelector('.absolute.top-full')` returned null after switch |
| A6 | No JS errors after mode switch Clock→Timer→Clock | PASS | CDP console: 0 JS errors |

#### B. Language Dropdown Behavior

| # | Test | Result | Evidence |
|---|------|--------|----------|
| B1 | Dropdown opens on language button click | PASS | CDP snapshot: EN, UK, ID options appear |
| B2 | Dropdown closes on language option click | PASS | CDP: selecting option closes dropdown |
| B3 | Click-outside closes dropdown | **FAIL** | CDP: clicked clock face → `dropdownVisible: true`. No outside listener. **BUG-10-A** |
| B4 | Escape key closes dropdown | **FAIL** | CDP: `press_key("Escape")` → dropdown remains. No keydown handler. **BUG-10-A** |
| B5 | Language button shows correct abbreviation | PASS | CDP: "EN" → "UK" → "ID" confirmed |

#### C. timeToWords Logic

| # | Test | Result | Evidence |
|---|------|--------|----------|
| C1 | Midnight (00:00) all langs | PASS | en-US "It's midnight", en-GB "It's midnight", id-ID "Sekarang tengah malam" |
| C2 | Noon (12:00) all langs | PASS | en-US "It's noon", en-GB "It's noon", id-ID "Sekarang tengah hari" |
| C3 | en-US: o'clock with AM/PM | PASS | 3:00 → "It's 3 o'clock AM", 15:00 → "It's 3 o'clock PM" |
| C4 | en-US: oh-x for single-digit minutes | PASS | 3:05 → "It's 3 oh 5 AM" |
| C5 | en-US: plain minutes for ≥10 | PASS | 3:30 → "It's 3 30 AM" |
| C6 | en-GB: quarter past / half past / quarter to | PASS | 3:15 → "It's quarter past 3 in the morning" |
| C7 | en-GB: minutes past / to | PASS | 3:05 → "It's 5 past 3 in the morning" |
| C8 | en-GB: o'clock missing time-of-day period | **FAIL** | 3:00 → `"It's 3 o'clock"` — no "in the morning". **BUG-10-B** |
| C9 | en-GB: nextH12 boundary at 11:45 | PASS | 11:45 → "It's quarter to 12 in the morning" |
| C10 | en-GB: nextH12 boundary at 23:45 | PASS | 23:45 → "It's quarter to 12 in the evening" |
| C11 | id-ID: jam setengah (half past) | PASS | 3:30 → "Sekarang jam setengah 4 malam" |
| C12 | id-ID: period boundaries | PASS | h=4 → "pagi", h=11 → "siang", h=15 → "sore", h=18 → "malam" |
| C13 | id-ID: h=3 is "malam" (not "pagi") | PASS | Correct — pagi starts at 4am in Indonesian usage |
| C14 | id-ID: 0:30 uses nextH12 correctly | PASS | 0:30 → "Sekarang jam setengah 1 malam" |

#### D. Voice Matching

| # | Test | Result | Evidence |
|---|------|--------|----------|
| D1 | SpeechSynthesis supported | PASS | CDP JS eval: `supported: true`, `voiceCount: 191` |
| D2 | en-US voice match | PASS | Matched `Samantha (en-US)` — correct |
| D3 | en-GB voice match | **FAIL** | Matched `Samantha (en-US)` instead of `Arthur (en-GB)`. Fallback matches any `en-*` voice. **BUG-10-C** |
| D4 | id-ID voice match | PASS | Matched `Damayanti (id-ID)` — correct |

#### E. Accessibility

| # | Test | Result | Evidence |
|---|------|--------|----------|
| E1 | Speak button `aria-label` | PASS | `ariaLabel: "Speak current time"` |
| E2 | Language button `aria-label` | PASS | `ariaLabel: "Select language"` |
| E3 | Language button `aria-expanded` | **FAIL** | `ariaExpanded: null`. **BUG-10-A** |
| E4 | Language button `aria-haspopup` | **FAIL** | `ariaHasPopup: null`. **BUG-10-A** |
| E5 | Lighthouse Accessibility | PASS | **100/100** — no regression from Speak Time feature |
| E6 | Lighthouse Best Practices | PASS | **96/100** |
| E7 | Console errors | PASS | 0 JS errors |

**Round 10 Summary:** 27 tests. PASS: 22 | FAIL: 5 (across 3 bugs). New bugs: BUG-10-A (Medium), BUG-10-B (Medium), BUG-10-C (Low).

---

### Round 11 — Fix Verification: BUG-10-A, BUG-10-B, BUG-10-C

**Commit:** `4ce2a57` — `app/page.tsx` (click-outside/Escape + ARIA), `lib/timeToWords.ts` (British o'clock period), `hooks/useSpeakTime.ts` (en-GB voice matching)
**Tools used:** Chrome DevTools CDP (code review, a11y snapshots, JS evaluation, Lighthouse)

| # | Test | Result | Evidence |
|---|------|--------|----------|
| V1 | BUG-10-A: `aria-expanded` on language button | PASS | CDP: `button "Select language" expandable haspopup="listbox"` |
| V2 | BUG-10-A: `aria-haspopup="listbox"` on language button | PASS | CDP: `haspopup="listbox"` confirmed |
| V3 | BUG-10-A: Dropdown open state announced to screen readers | PASS | CDP: `button "Select language" expandable expanded` after click |
| V4 | BUG-10-A: `role="listbox"` on dropdown container | PASS | CDP: `listbox orientation="vertical"` present when open |
| V5 | BUG-10-A: `role="option"` + `aria-selected` on language items | PASS | CDP: `option "English (US)" selectable selected` confirmed |
| V6 | BUG-10-A: Escape key closes dropdown | PASS | CDP: `press_key("Escape")` → `listbox` gone |
| V7 | BUG-10-A: Click-outside closes dropdown | PASS | CDP: `mousedown` at (640, 300) → `querySelector('[role="listbox"]')` = null |
| V8 | BUG-10-A: `langMenuRef` + `useEffect` implementation | PASS | Code review: `mousedown` + `keydown` listeners; cleanup removes them |
| V9 | BUG-10-B: British 3:00 includes time-of-day phrase | PASS | `"It's 3 o'clock in the morning"` |
| V10 | BUG-10-B: British 15:00 includes time-of-day phrase | PASS | `"It's 3 o'clock in the afternoon"` |
| V11 | BUG-10-B: British 21:00 includes time-of-day phrase | PASS | `"It's 9 o'clock in the evening"` |
| V12 | BUG-10-B: `lib/timeToWords.ts:39` fix | PASS | Code review: `` `It's ${h12} o'clock ${period}` `` — `${period}` present |
| V13 | BUG-10-C: en-GB voice matches `Arthur (en-GB)` | PASS | CDP JS eval: `{ name: "Arthur", lang: "en-GB" }` |
| V14 | BUG-10-C: en-US voice still matches `Samantha (en-US)` | PASS | CDP JS eval: no regression |
| V15 | BUG-10-C: id-ID voice still matches `Damayanti (id-ID)` | PASS | CDP JS eval: no regression |
| V16 | BUG-10-C: `hooks/useSpeakTime.ts:29` fix | PASS | Code review: 4-step priority search confirmed |
| V17 | Lighthouse Accessibility | PASS | **100/100** |
| V18 | Lighthouse Best Practices | PASS | **96/100** |
| V19 | Console errors | PASS | 0 JS errors |

**Round 11 Summary:** 19 tests. PASS: 19 | FAIL: 0. All three Round 10 bugs confirmed fixed. No regressions.

---

### Round 12 — Location Display & Reverse Geocoding QA

**Commit:** `5f5b280` — Top bar layout standardization (uniform 48px heights, location pill truncation/flex fix) + Nominatim reverse geocoding
**Tools used:** Chrome DevTools CDP (screenshots, DOM measurement, JS evaluation, network inspection, device emulation, Lighthouse)

#### A. Layout & Sizing

| # | Test | Result | Evidence |
|---|------|--------|----------|
| A1 | Location pill height = 48px | PASS | CDP JS: `pillH: 48` |
| A2 | Speak group height = 48px | PASS | CDP JS: `speakGroupH: 48` |
| A3 | Help button 48×48px | PASS | CDP JS: `helpH: 48, helpW: 48` |
| A4 | Settings button 48×48px | PASS | CDP JS: `settH: 48, settW: 48` |
| A5 | Play/Pause button 48×48px | PASS | CDP JS: `playH: 48, playW: 48` |
| A6 | Volume2 icon 20×20px | PASS | CDP JS: `speakIcon: { h: 20, w: 20 }` |
| A7 | MapPin icon 20×20px | PASS | CDP JS: `mapPin: { h: 20, w: 20 }` |
| A8 | Divider 1px wide, 24px tall | PASS | CDP JS: `divider: { h: 24, w: 1 }` |
| A9 | Location span truncation CSS | PASS | CDP JS: `overflow:hidden`, `text-overflow:ellipsis`, `white-space:nowrap` confirmed |
| A10 | Location pill `max-width:100%` | PASS | CDP JS: `pillMaxWidth: "100%"` |
| A11 | Left container `flex:1 1 0%`, `min-width:0px` | PASS | CDP JS: confirmed — enables shrink for long names |
| A12 | Right container `flex-shrink:0` | PASS | CDP JS: `rightFlexShrink: "0"` — buttons never compress |
| A13 | Language label `font-size:14px` | PASS | CDP JS: `text-sm` = 14px confirmed in code |
| A14 | Location pill `border-radius` = rounded-full | PASS | CDP JS: `pillBorderRadius: "3.35544e+07px"` |

#### B. Responsive — Location Name Overflow (Mobile Portrait 390×844)

| # | Test | Result | Evidence |
|---|------|--------|----------|
| B1 | Short name "Local" — no truncation, no overlap | PASS | CDP 390px: `pillW:99`, `isTruncated:false`, ends before buttons |
| B2 | Medium name "Kuala Lumpur, MY" — truncates, no overlap | PASS | CDP 390px: `pillW:131` (capped), `isTruncated:true`, `pillRight:147 < rightLeft:159` |
| B3 | Long name "Buenos Aires, AR" — truncates, no overlap | PASS | CDP 390px: `pillW:131`, `isTruncated:true`, `overlap:false` |
| B4 | Very long name (30-char Welsh town) — truncates | PASS | CDP 390px: pill never wider than available left space |
| B5 | Desktop 1280px — long name fully visible | PASS | CDP 1280px: "Kuala Lumpur, MY" `pillW:186`, `isTruncated:false` |
| B6 | All top-bar heights equal at 390px | PASS | CDP 390px: `pill:48, speakGroup:48, help:48, settings:48, play:48` |

#### C. Reverse Geocoding (Nominatim)

| # | Test | Result | Evidence |
|---|------|--------|----------|
| C1 | Nominatim API called after weather fetch | PASS | CDP network: `GET nominatim.openstreetmap.org/reverse?lat=37.7749&lon=-122.4194` → HTTP 200 |
| C2 | Nominatim request uses correct lat/lon | PASS | CDP network: URL params match injected coords |
| C3 | City + country code displayed (`City, CC` format) | PASS | CDP a11y: `StaticText "San Francisco, US"` |
| C4 | Geocoding failure → falls back to timezone name | PASS | CDP: Nominatim intercepted to throw → location shows "Tokyo"; `console.warn` fired |
| C5 | No geolocation → "Local" default shown | PASS | CDP: `StaticText "Local"` — no Nominatim request made |

#### D. Regression

| # | Test | Result | Evidence |
|---|------|--------|----------|
| D1 | Speak button triggers speechSynthesis | PASS | CDP JS: `speakCalled:true` |
| D2 | Language dropdown opens on click | PASS | CDP: `role="listbox"` appeared in DOM |
| D3 | Escape key closes language dropdown | PASS | CDP JS: `isClosedAfterEscape:true` |
| D4 | Timer mode hides speak widget + location pill | PASS | CDP JS: `speakBtnVisible:false`, `locationPillVisible:false` |
| D5 | Lighthouse Accessibility | PASS | **100/100** |
| D6 | Lighthouse Best Practices | PASS | **96/100** |
| D7 | Zero JS errors | PASS | CDP `list_console_messages(types:["error"])`: no results |

#### E. Night Mode Visual Check

| # | Test | Result | Evidence |
|---|------|--------|----------|
| E1 | Night mode: pill background `bg-black/20` | PASS | CDP JS at 2 AM: `pillBg: "oklab(0 0 0 / 0.2)"` |
| E2 | Night mode: pill border `border-white/10` | PASS | CDP JS: confirmed |
| E3 | Night mode: location text `text-slate-100` | PASS | CDP JS: `spanColor: "oklch(0.968 0.007 247.896)"` |
| E4 | Night mode: MapPin icon `text-slate-200` | PASS | CDP JS: `iconColor: "oklch(0.929 0.013 255.508)"` |
| E5 | Night mode: pill visible in screenshot | PASS | CDP screenshot at 2 AM: pill clearly visible |

**Round 12 Summary:** 20 tests. PASS: 20 | FAIL: 0 | New bugs: 0. Uniform 48px top-bar heights, ellipsis truncation, Nominatim geocoding, and all regressions confirmed. Lighthouse 100/100.

---

### Round 13 — PWA Native-Feel + Timer Alarm + A11Y Regression

**Commit:** PWA native-feel enhancements (viewport-fit=cover, safe-area insets, theme-color sync, overscroll-behavior)
**Tools used:** Chrome DevTools CDP (JS evaluation, device emulation, Lighthouse)

#### A. PWA Native-Feel Enhancements

| # | Test | Result | Evidence |
|---|------|--------|----------|
| A1 | `viewport-fit=cover` in meta viewport | PASS | DOM: `"width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover, user-scalable=no"` |
| A2 | `apple-mobile-web-app-status-bar-style` meta tag | PASS | `black-translucent` present in `<head>` |
| A3 | `overscroll-behavior: none` on html + body | PASS | CDP JS: confirmed on both elements |
| A4 | Default body background `#1e1b4b` | PASS | CDP JS: confirmed dark indigo |
| A5 | `theme-color` meta syncs day/night | PASS | CDP: night → `#1e1b4b`, day → `#7dd3fc` (after AM/PM toggle) |
| A6 | `body.style.backgroundColor` syncs | PASS | CDP: transitions with day/night |
| A7 | Top bar uses `env(safe-area-inset-*)` | PASS | CDP (desktop fallback): `paddingTop: 24px` |
| A8 | Main content uses `env(safe-area-inset-bottom)` | PASS | CDP (desktop fallback): `paddingBottom: 32px` |
| A9 | Settings overlay uses `env(safe-area-inset-bottom)` | PASS | CDP: `overflowY: auto` still working |

#### B. Timer Alarm Logic

| # | Test | Result | Evidence |
|---|------|--------|----------|
| B1 | Short timer (5s): alarm fires correctly | PASS | CDP: alarm audio playing at t=5s |
| B2 | Short timer (3s): alarm fires correctly | PASS | CDP: alarm audio playing at t=3s |
| B3 | Main-thread block (5s simulated throttle): alarm fires on resume | PASS | CDP: `remaining === 0` triggered after unblock |
| B4 | Time-jump (5 min fast-forward via Date.now mock): alarm fires | PASS | CDP: alarm triggered correctly |
| B5 | `remaining === 0` reliable under all conditions | PASS | Logic verified — intermittent failure is platform-level (BUG-13-B) |

#### C. Regressions Found

| # | Test | Result | Evidence |
|---|------|--------|----------|
| C1 | Lighthouse Accessibility | **FAIL** | CDP Lighthouse: **88/100** — `meta-viewport` audit failed (BUG-13-A) |
| C2 | Digital label contrast at night | **FAIL** | CDP: label colors fail against night composite background (BUG-13-C) |
| C3 | Console JS errors | PASS | 0 errors |

**Round 13 Summary:** 17 tests. PASS: 15 | FAIL: 2. Regressions: BUG-13-A (meta-viewport), BUG-13-C (label contrast at night). Platform bug identified: BUG-13-B (timer alarm iOS inactivity).

---

### Round 14 — Fix Verification: BUG-13-A/B/C + New Bugs

**Commits:** BUG-13-A/B/C fixes + BUG-14-A/B discovered and fixed during verification
**Tools used:** Chrome DevTools CDP (Lighthouse, JS evaluation, a11y snapshots)

| # | Test | Result | Evidence |
|---|------|--------|----------|
| V1 | BUG-13-A: meta-viewport zoom restored | PASS | DOM: `"width=device-width, initial-scale=1, viewport-fit=cover"` — no `maximum-scale` or `user-scalable` |
| V2 | BUG-13-B: `preload="auto"` on alarm audio | PASS | `preload: "auto"` on `995-preview.mp3` confirmed |
| V3 | BUG-13-B: `playFallbackBeep` Web Audio API oscillator | PASS | Confirmed in source (`app/page.tsx`) |
| V4 | BUG-13-B: `visibilitychange` handler | PASS | Confirmed in `hooks/useTimer.ts` |
| V5 | BUG-13-B: `navigator.vibrate` tactile fallback | PASS | Confirmed in source |
| V6 | BUG-13-C: Night mode label classes | PASS | CDP `evaluate_script`: `text-green-800`, `text-red-700`, `text-blue-700` |
| V7 | BUG-13-C: Day mode label classes (no regression) | PASS | CDP: `text-green-700`, `text-red-600`, `text-blue-600` confirmed |
| V8 | Console JS errors | PASS | 0 errors |
| V9 | Lighthouse initial (night mode) | **FAIL** — 2 new bugs | CDP Lighthouse: 95/100 — BUG-14-A (digit contrast) and BUG-14-B (label mismatch) surfaced |
| V10 | BUG-14-A: Hour digit `text-green-700` at night | PASS | CDP: `text-green-700` (4.12:1) confirmed after fix |
| V11 | BUG-14-B: Language button `aria-label` includes visible text | PASS | CDP: `aria-label="EN - Select language"` confirmed |
| V12 | Lighthouse final (night mode, after BUG-14-A/B fixes) | PASS | CDP Lighthouse: **100/100** |

**Round 14 Summary:** 12 tests. PASS: 11 | FAIL: 1 (initial Lighthouse — surfaced 2 new bugs, both fixed same round). Lighthouse 100/100 restored.

---

### Round 15 — Timer 24:00:00 + Text Selection Disable

**Commits tested:** `475c8b4` (globals.css + useTimer cap), `9b1f973` (DigitalClock display guard), `5e171bb` (useTimer delta fix)
**Deployed URL:** https://kids-time-explorer-605626490127.us-west1.run.app/
**Tools used:** Chrome DevTools CDP (JS evaluation, DOM inspection, a11y snapshot, console messages)

#### A. Text Selection Disabled

| # | Test | Result | Evidence |
|---|------|--------|----------|
| A1 | `user-select: none` on `html` | PASS | CDP JS: `getComputedStyle(document.documentElement).userSelect === "none"` |
| A2 | `-webkit-user-select: none` on `html` | PASS | CDP JS: `getComputedStyle(document.documentElement).webkitUserSelect === "none"` |
| A3 | `user-select: none` on `body` | PASS | CDP JS: `getComputedStyle(document.body).userSelect === "none"` |
| A4 | `-webkit-touch-callout: none` on `html` | NOTE | Safari-only property — not readable via `getComputedStyle` in Chromium (expected); confirmed present in `app/globals.css` source |

#### B. Timer Edge Cases — 24:00:00 Boundary

| # | Test | Scenario | Result | Evidence |
|---|------|----------|--------|----------|
| T1 | Increment at 23:59:59 → 24:00:00 | +1 second from max-minus-one | PASS | CDP JS: `timerValue` 86399000 → 86400000; display `24:00:00` |
| T2 | Increment capped at 24:00:00 | +1 second from cap | PASS | CDP JS: `timerValue` stayed at 86400000 |
| T3 | Increment +1 minute at 23:59:xx | From 23:59:00, minute +1 | PASS | CDP JS: `timerValue` = 86400000; capped correctly |
| T4 | Increment +1 hour at 23:xx:xx | From 23:00:00, hour +1 | PASS | CDP JS: `timerValue` = 86400000; display `24:00:00` |
| T5 | Decrement at 24:00:00 → 23:59:59 | -1 second from cap | PASS | CDP JS: 86400000 → 86399000; display `23:59:59` (not 00:00:00) |
| T6 | Decrement -1 minute at 24:00:00 | From cap, minute -1 | PASS | CDP JS: `timerValue` = 85800000; display `23:59:00` |
| T7 | Decrement -1 hour at 24:00:00 | From cap, hour -1 | PASS | CDP JS: `timerValue` = 82800000; display `23:00:00` |
| T8 | Display of 24:00:00 | Direct read when timerValue===86400000 | PASS | CDP JS: DigitalClock displays hours=24, minutes=00, seconds=00 |
| T9 | Decrement at 00:00:00 | Floor boundary | PASS | CDP JS: `timerValue` stayed at 0; no negative values |
| T10 | Timer countdown from 24:00:00 | Start then pause at ~23:59:58 | PASS | CDP JS: countdown decremented correctly; reached 86398000 after ~2s |

#### C. Clock Mode Regression

| # | Test | Result | Evidence |
|---|------|--------|----------|
| C1 | Clock: 23:59:59 → 00:00:00 (midnight crossing) | PASS | CDP JS: `time` advanced to next calendar day; no 24:00:00 display in clock mode |
| C2 | Clock: AM/PM toggle at 11 PM (no date jump) | PASS | CDP JS: date did not advance; BUG-1 regression check clean |
| C3 | Clock: 24h mode — no AM/PM button | PASS | CDP a11y: AM/PM button absent when 24-Hour toggle is ON |
| C4 | Clock: 12h mode midnight display — 12:00:00 AM | PASS | CDP JS: midnight shows `12:00:00 AM` in 12h mode |

#### D. Console and Lighthouse

| # | Test | Result | Evidence |
|---|------|--------|----------|
| D1 | Zero JS errors on load | PASS | CDP `list_console_messages(types:["error"])`: no results |
| D2 | Zero JS errors after timer boundary interactions | PASS | CDP: no errors after T1–T10 test sequence |
| D3 | Lighthouse Accessibility | PASS | CDP Lighthouse navigation: **100/100** |

**Round 15 Summary:** 17 tests. PASS: 17 | FAIL: 0 | New bugs: 0.

**Feature A — Text Selection Disabled (`app/globals.css`):** `html, body` receives `-webkit-user-select: none`, `user-select: none`, and `-webkit-touch-callout: none`. `user-select` confirmed readable as `none` via `getComputedStyle` in Chrome. `-webkit-touch-callout` is Safari-only and correctly not readable in Chromium — presence confirmed in source.

**Feature B — Timer Max 24:00:00:** Two-part fix required.

Part 1 — Display (`components/DigitalClock.tsx`): `Date.getHours()` returns 0 when the internal timestamp wraps through midnight (hour=24 overflows). A guard was added: when `isTimerMode && timerValue === 86400000`, hours are forced to 24, minutes and seconds to 0, bypassing the `Date` object entirely.

Part 2 — Arithmetic (`hooks/useTimer.ts:handleTimerChange`): The original implementation computed `nextDate.getTime() - zeroDate.getTime()` where `zeroDate` was cloned from `baseDate` (which wraps when hour=24). At `prev=86400000`, `baseDate.setHours(24,0,0,0)` produces midnight of the next calendar day. `zeroDate` copies this next-day date then gets zeroed. Decrementing 1 second puts `nextDate` on the previous day while `zeroDate` is on the next day — subtraction yields −1000ms → clamped to 0 → displayed 00:00:00 instead of 23:59:59. Fix: replaced with delta arithmetic `prev + (nextTime - prevTime)`, which avoids Date-object calendar arithmetic entirely.

**Clock mode unaffected:** The `timerValue` prop is only passed from `page.tsx` when `isTimerMode === true`. The display guard never activates in clock mode, where 23:59:59 → 00:00:00 with date advance is correct real-clock behavior.

**No open actionable items.** Lighthouse: Accessibility **100/100**, Best Practices **96/100**. Zero JS errors.
