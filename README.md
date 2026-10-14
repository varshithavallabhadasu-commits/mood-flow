# MoodFlow — Smart Study Planner

A responsive React + TypeScript + Tailwind CSS study planner. No paid API, authentication, or database required.

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite (normally http://localhost:5173).

Production build: `npm run build`; preview it with `npm run preview`.

## Features

- Dashboard with real task and focus-session statistics
- Add, edit and delete tasks with priority, difficulty, deadlines and remaining time
- Mood and energy-aware deterministic scheduler
- Study plan timeline with transparent explanations and breaks
- Focus countdown timer with pause, resume, reset and completion confirmation
- Study history and weekly activity chart
- Light/dark mode, responsive navigation, localStorage persistence

## How it works

Task score = urgency points + priority points + energy/difficulty compatibility points. Overdue tasks receive the highest urgency score. Scheduling greedily selects the highest-scored unfinished task, splits it into study blocks and adds short breaks if enough time remains. All blocks stay within the selected time budget. Generated plans do not alter task progress; confirming a focus block does.

## Limitations

- Data lives only in the current browser's localStorage. Clearing site data deletes it.
- A timer is not a verification of actual study; the student must confirm completion honestly.
- No server-side syncing or login is provided.
- Study session timer resets on a page refresh; confirmed history persists.
- Plans are snapshots; after editing/deleting tasks, regenerate before studying.
