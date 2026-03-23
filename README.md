

**Use your preferred IDE**



Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

# Activity Ranking – Test Suite

This directory contains BDD specs, Appium automated tests, and a manual test script for the Activity Ranking feature.

## Structure

```
tests/
├── bdd/
│   └── activity-ranking.feature     # Gherkin BDD scenarios
├── appium/
│   ├── wdio.conf.ts                 # WebDriverIO + Appium 2.x config
│   └── specs/
│       └── activity-ranking.spec.ts # Automated test implementations
├── manual/
│   └── MANUAL_TEST_SCRIPT.md        # Step-by-step manual test script
└── README.md                        # This file
```

## Prerequisites

1. **Node.js 18+** and **npm**
2. **Appium 2.x** installed globally:
   ```bash
   npm install -g appium
   ```
3. **Appium drivers** installed:
   ```bash
   appium driver install uiautomator2   # Android
   appium driver install xcuitest        # iOS
   ```
4. **Android SDK** with an emulator (e.g. Pixel 7 API 34) or a connected device
5. **Xcode** (macOS only) for iOS testing

## Running Automated Tests

### 1. Install dependencies

```bash
npm install --save-dev @wdio/cli @wdio/local-runner @wdio/mocha-framework @wdio/spec-reporter webdriverio
```

### 2. Start Appium server

```bash
appium --use-drivers=uiautomator2,xcuitest
```

### 3. Build the app

For a WebView-based mobile app (e.g. Capacitor):
```bash
npm run build
npx cap sync
```

### 4. Run tests

**Android:**
```bash
PLATFORM=Android DEVICE_NAME="Pixel_7_API_34" APP_PATH="./android/app/build/outputs/apk/debug/app-debug.apk" \
  npx wdio tests/appium/wdio.conf.ts
```

**iOS:**
```bash
PLATFORM=iOS DEVICE_NAME="iPhone 15" APP_PATH="./ios/App/build/App.app" \
  npx wdio tests/appium/wdio.conf.ts
```

## Adding Accessibility IDs

For the Appium tests to work, add `aria-label` attributes to key elements in the React components. The tests use these locators:

| Accessibility ID | Element |
|------------------|---------|
| `City search` | Search input field |
| `city-suggestion` | Each autocomplete suggestion item |
| `activity-card` | Each ranking result card |
| `activity-name` | Activity name text within a card |
| `activity-rank` | Rank badge within a card |
| `activity-reasoning` | Reasoning text within a card |
| `loading-spinner` | Loading indicator |
| `error-message` | Error message text |

## Running Manual Tests

Open `tests/manual/MANUAL_TEST_SCRIPT.md` and follow the step-by-step instructions on physical devices or emulators.

