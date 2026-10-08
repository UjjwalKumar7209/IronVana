# IronVana

IronVana is a personal workout-tracking Progressive Web App built with Next.js, React, TypeScript, Tailwind CSS, and Lucide React.

It follows a fixed six-day workout split:

- Monday: Rest day
- Tuesday: Day 1
- Wednesday: Day 2
- Thursday: Day 3
- Friday: Day 4
- Saturday: Day 5
- Sunday: Day 6

## Features

- Automatic workout selection from the device date
- Monday rest-day experience
- Responsive mobile-first dashboard
- Today, Week, History, and Settings views
- Exercise-level completion tracking
- Two working sets per exercise
- Notes saved per exercise and date
- Historical progress stored by date
- First-launch profile name prompt
- Dark and light themes
- Exercise instructions modal
- Installable PWA with offline shell caching
- Real exercise-reference images with graceful fallbacks

## Requirements

- Node.js 18.18 or newer
- npm

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

## Production Build

Create an optimized production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Project Structure

```text
app/
  page.tsx                    Main application and views
  layout.tsx                  Metadata, fonts, and global layout
  globals.css                 Application styling
  ServiceWorkerRegistration.tsx

data/
  workouts.ts                 Workout split and exercise image data

lib/
  workoutStorage.ts           LocalStorage persistence helpers

public/
  icon.svg                    Favicon and app icon
  manifest.json               PWA manifest
  sw.js                      Service worker
```

## Data Storage

Workout progress is stored in the browser's LocalStorage. Each date gets its own storage key:

```text
ironvana-progress-YYYY-MM-DD
```

The saved profile name uses:

```text
ironvana-user-name
```

No backend or external database is required.

## Exercise Images

Exercise image URLs are centralized in [data/workouts.ts](data/workouts.ts). The app uses real exercise-reference images from the Free Exercise DB repository:

[https://github.com/yuhonas/free-exercise-db](https://github.com/yuhonas/free-exercise-db)

To replace an image, update the corresponding path in `exerciseImageFiles`. If an image cannot load, the exercise card displays a clean text fallback instead of breaking the layout.

## PWA Installation

Run the app over a production build or a supported local development environment, then use the browser's install option. On supported browsers, the Settings page also exposes the install action when the browser provides an install prompt.

The PWA configuration is defined in:

- `public/manifest.json`
- `public/sw.js`
- `public/icon.svg`

## Deployment

The app can be deployed to any platform that supports Next.js, including Vercel:

1. Push the project to a Git repository.
2. Import the repository into the deployment provider.
3. Use `npm install` for installation.
4. Use `npm run build` as the build command.
5. Use `npm start` as the start command when required by the host.

The app is client-focused and does not require environment variables, API keys, or database configuration.

## License Notes

The application code is personal project code. Exercise reference images are served from the Free Exercise DB project and should be reviewed under that project's licensing terms before redistribution.
