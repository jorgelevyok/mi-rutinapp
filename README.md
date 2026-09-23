# Mi Rutinapp

**Build a stronger you.**

Mi Rutinapp is a React Native (Expo) workout companion for creating and running your training routines. Track exercises set by set, rest with a chronometer, and see how many times you’ve completed each routine this week — so you never forget whether you already trained.

---

## What the app does

- **Create & edit routines** with custom exercises, sets, reps, weights, and rest times
- **Train a routine** exercise by exercise, marking sets and exercises as done
- **Rest chronometer** between sets and between exercises
- **Weekly schedule** — set how many times per week you plan to do each routine (e.g. Push 2×/week)
- **Weekly progress** — each completed session counts toward that goal (`1/2`, `2/2`, …); resets every Monday
- **Local persistence** — routines are saved on the device with AsyncStorage

Tagline: *Build a stronger you.*

---

## Screens

### Splash (`/`)

Welcome screen with the brand logo, tagline, short support copy, and a **Get Started** button that takes you to Home.

### Home / My Routines (`/home`)

Main hub listing all routines as colored cards.

- Shows exercise count, estimated duration, and times per week
- Badge for weekly progress (e.g. `1/3 this week`)
- Check button to manually add/undo a session for the week
- **Create New Routine** and `+` open the create flow
- Bottom nav: **Routines** · **Progress** · **Profile**

### Create Routine (`/routine/create`)

Form to build a new routine:

| Field | Description |
| --- | --- |
| Routine name | Display name |
| Rest between exercises | Seconds of rest when moving to the next exercise |
| Times per week | How many sessions you aim for (1–7), with − / + steppers |
| Exercises | List of exercises (add, edit, reorder, delete) |

Each exercise has sets, reps, weight, and **rest between sets**.

**Add Exercise** and **Save Routine** stay fixed at the bottom. After saving, you return to **Home**.

### Edit Routine (`/routine/[id]/edit`)

Same form as create, prefilled with the routine. After saving, you go back to that routine’s detail screen.

### Routine detail (`/routine/[id]`)

Active workout view for one routine:

- **This week** banner — progress like `1/3 done`; tap to add or undo a session
- Edit shortcut
- Rest-between-exercises chronometer
- Exercise switcher chips
- Sets panel — edit weight/reps, check off sets, mark exercise complete
- When **all exercises** are completed, one weekly session is recorded and set/exercise checks reset so you can run the next session

### Progress (`/progress`)

Placeholder for future stats (volume, streaks, PRs). Bottom nav included.

### Profile (`/profile`)

Placeholder for account and preferences. Bottom nav included.

---

## Tech stack

- **Expo** ~57 + **Expo Router** (file-based navigation)
- **React Native** / **React** 19
- **TypeScript**
- **Zustand** — routine state
- **AsyncStorage** — persistence
- **Lucide** — icons
- Fonts: **Syne** (display) + **DM Sans** (body)

Design reference lives in `design/mi_rtinapp.pen`.

---

## Getting started

### Requirements

- Node.js 18+ recommended
- npm (or yarn / pnpm)
- [Expo Go](https://expo.dev/go) on a phone, **or** an iOS Simulator / Android Emulator

### Install

```bash
cd mi-rutinapp
npm install
```

### Run

```bash
npm start
# or
npx expo start
```

Then:

- Press `a` — Android emulator  
- Press `i` — iOS simulator  
- Scan the QR code with **Expo Go** (Android) or the Camera app (iOS)  
- Press `w` — web (limited)

Other scripts:

```bash
npm run android
npm run ios
npm run web
npm run lint
```

---

## Project structure (high level)

```
mi-rutinapp/
├── src/
│   ├── app/                 # Expo Router routes
│   ├── components/          # Shared UI (header, nav, buttons, …)
│   ├── features/routines/   # Screens, form, workout panels, hooks
│   ├── mocks/               # Seed routines (Push, Pull, Legs, Full Body)
│   ├── services/            # Storage + routine service
│   ├── store/               # Zustand store
│   ├── theme/               # Colors, typography, spacing
│   ├── types/               # Domain types
│   └── utils/               # Formatters, week helpers
├── assets/                  # Images & illustrations
├── design/                  # Pencil / design files
└── package.json
```

---

## Data model (simplified)

A **routine** includes:

- Name, accent color, estimated minutes  
- `restBetweenExercisesSeconds`  
- `timesPerWeek` (weekly target)  
- `completedAtDates` (session timestamps; UI counts those in the current week)  
- **Exercises** → sets (reps, weight, completed) + `restSeconds` between sets  

Week starts on **Monday** (local time).

---

## Notes

- Progress and Profile screens are stubs (“Coming soon”).
- Routines are stored locally only (no backend / auth yet).
- Seed data includes Push, Pull, Legs, and Full Body with sample exercises.
