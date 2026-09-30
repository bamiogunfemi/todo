# Todo

A simple, fast to-do list built with **Vite + React + TypeScript + Tailwind CSS**. Tasks are saved in your browser's `localStorage`. There's no backend and no account to create.

## Features

- Add, edit and delete tasks (deleting asks you to confirm first)
- Mark tasks complete or incomplete
- Title, description, priority (low/medium/high), due date and tags
- Views: All, Today, Upcoming, Overdue, Completed (each with a count)
- Search by title, description or tag; filter by status and priority; sort by due date, priority, newest or title
- Completion percentage and open tasks grouped by priority
- Responsive: sidebar on desktop, scrollable tabs on mobile

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

## Scripts

| Command             | What it does                       |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Start the dev server               |
| `npm run build`     | Type-check and build to `dist/`    |
| `npm run preview`   | Serve the production build         |
| `npm run lint`      | Lint with oxlint                   |
| `npm run typecheck` | Type-check only                    |

## Structure

```
src/
  types.ts             Task and query types
  lib/tasks.ts         Pure logic: create/update/toggle, filtering, sorting, stats
  lib/storage.ts       localStorage load/save that validates what it reads
  hooks/useTasks.ts    State plus persistence
  components/          TaskForm, TaskItem, Toolbar, Sidebar, ConfirmDialog
  App.tsx              Page layout
```

## Deploying

`npm run build` outputs a static site in `dist/`. You can host it on any static host, such as Netlify, Vercel, GitHub Pages or Cloudflare Pages.

## Limitations

- Data lives in one browser on one device. Clearing site data deletes your tasks, and nothing syncs between devices.
- There are no user accounts.
- There are no AI features. They would need a server to keep the API key secret.
