# Manual Test Script – Activity Ranking (Mobile)

## Preconditions

| # | Condition |
|---|-----------|
| 1 | App is installed on Android (API 30+) and iOS (16+) test devices |
| 2 | Device has active WiFi or cellular connection |
| 3 | Device location services are NOT required (city is searched manually) |
| 4 | App is freshly launched (no cached state) |

---

## Test Cases

### TC-01: Autocomplete – Basic Flow

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Launch the app | Home screen with search input is visible |
| 2 | Tap the search input | Keyboard opens; cursor in input field |
| 3 | Type "Lon" slowly (one char per second) | After typing "Lo", no suggestions yet. After "Lon", suggestions appear within ~1s |
| 4 | Verify suggestion list | At least 1 suggestion visible; each shows city name + country |
| 5 | Tap "London, United Kingdom" | Input shows "London, United Kingdom"; dropdown closes |

### TC-02: Autocomplete – No Results

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Clear the search input | Input is empty |
| 2 | Type "xyzzzqqq" | No suggestions appear after 1 second |
| 3 | Type "!!@@##" | No suggestions appear; app does not crash |

### TC-03: 7-Day Ranking Display

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Search and select "London, United Kingdom" | Loading spinner appears briefly |
| 2 | Wait for results to load | Spinner disappears; ranking cards are displayed |
| 3 | Count day sections | Exactly 7 day sections are visible |
| 4 | Verify each day section | Each contains 4 activity cards |
| 5 | Verify first activity card | Shows: Activity name, Rank (N/10), Reasoning text |
| 6 | Verify rank range | All ranks are between 1 and 10 |

### TC-04: Supported Activities

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | With results displayed, scroll through all cards | All 4 activities appear per day: Skiing, Surfing, Outdoor Sightseeing, Indoor Sightseeing |

### TC-05: Offline Behavior

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enable Airplane Mode on device | Network disconnected |
| 2 | Type "Rome" in search input | No suggestions appear (no network) |
| 3 | If cached suggestions exist, tap one | Error message: "Failed to fetch weather data. Please try again." |
| 4 | Disable Airplane Mode | Network restored |
| 5 | Retry the search | Suggestions and rankings load normally |

### TC-06: Slow Network

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Use device network throttling (Developer Settings) to simulate 2G | Network is slow |
| 2 | Search and select "Sydney, Australia" | Loading spinner is visible for a noticeable duration |
| 3 | Wait for results | Results eventually load; spinner disappears |

### TC-07: Device Rotation

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Load ranking results for any city in Portrait mode | Results visible |
| 2 | Rotate device to Landscape | Results remain visible; layout adjusts responsively |
| 3 | Rotate back to Portrait | Results still present; no data re-fetch |

### TC-08: Rapid Typing / Debounce

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Tap search input | Keyboard opens |
| 2 | Type "London" as fast as possible | App does NOT send a request per keystroke |
| 3 | Wait ~500ms after last keystroke | Final suggestions for "London" appear |

### TC-09: Accessibility (Screen Reader)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enable TalkBack (Android) or VoiceOver (iOS) | Screen reader is active |
| 2 | Navigate to search input | Reader announces "City search, text field" or similar |
| 3 | Type and select a city | Reader announces suggestion items |
| 4 | Navigate ranking cards | Reader announces activity name, rank, and reasoning |

### TC-10: Memory Pressure (Android)

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Open multiple heavy apps to create memory pressure | Other apps running |
| 2 | Switch back to Activity Ranking app | App resumes without crash; state is preserved if results were loaded |

---

## Edge Cases Summary

| Edge Case | Expected Behavior |
|-----------|-------------------|
| Empty search input | No suggestions; no API calls |
| Single character input | No suggestions (minimum 2 chars) |
| City with accented characters (e.g. "Zürich") | Suggestions appear correctly |
| Very long city name | Input field handles overflow gracefully |
| Network timeout mid-request | Error message displayed; app recoverable |
| Switching between dark/light mode | UI remains readable; colors adapt |
| Back button during loading | Loading cancels gracefully; no crash |
