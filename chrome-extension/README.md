# AI Job Tracker — Chrome Extension

One-click job import for LinkedIn, Indeed, Glassdoor, Greenhouse, Lever, Workday, Ashby, and SmartRecruiters.

## How it works

1. Navigate to any job posting on a supported site
2. Click the AI Job Tracker icon in your Chrome toolbar
3. Click **"Import this job"** — the extension opens your AI Job Tracker import page with the URL prefilled and starts parsing automatically

## Install (Developer Mode)

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (top right toggle)
3. Click **Load unpacked**
4. Select this `chrome-extension/` folder
5. The extension appears in your toolbar — pin it for easy access

## Configure your app URL

After installing, click the extension icon and set your **App URL** at the bottom of the popup (e.g. `https://yourapp.vercel.app`). This is saved locally in the extension.

## Add icons

Place the following PNG files in the `icons/` directory before loading the extension:
- `icon16.png` — 16×16 px
- `icon48.png` — 48×48 px
- `icon128.png` — 128×128 px

A simple blue square with a white "A" works well. You can generate them from the app's favicon.

## Supported sites

| Site | URL pattern |
|------|-------------|
| LinkedIn | `linkedin.com/jobs/*` |
| Indeed | `indeed.com/viewjob*`, `indeed.com/job/*` |
| Glassdoor | `glassdoor.com/job-listing/*` |
| Lever | `lever.co/*` |
| Greenhouse | `greenhouse.io/jobs/*` |
| Workday | `myworkdayjobs.com/*` |
| Ashby | `ashbyhq.com/*` |
| SmartRecruiters | `smartrecruiters.com/*` |

## Permissions used

- `activeTab` — read the current tab's URL and title
- `storage` — save your App URL preference locally (never sent anywhere)
