# Currency Converter

A small React + TypeScript currency converter built with Vite. It converts an amount between supported currencies using live or historical exchange-rate data from the Frankfurter API.

## Features

- Convert an amount between common currencies
- Choose the latest available rate or a historical date
- Swap source and destination currencies
- Loading, validation, and error states
- Responsive layout for desktop and mobile
- Vercel-ready static deployment

## Tech Stack

- React 19
- TypeScript
- Vite
- Vitest + Testing Library
- Lucide React icons
- Frankfurter exchange-rate API

## Requirements

- Node.js 24
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

Open the local URL printed by Vite, usually:

```text
http://127.0.0.1:5173/
```

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
npm run test
npm run test:watch
```

- `npm run dev`: starts the Vite development server.
- `npm run build`: runs TypeScript checks and creates a production build in `dist/`.
- `npm run preview`: serves the production build locally.
- `npm run test`: runs the test suite once.
- `npm run test:watch`: runs tests in watch mode.

## Data Source

The app calls:

```text
https://api.frankfurter.dev/v1
```

No API key is required. The latest endpoint returns the latest available market date, which can be earlier than today depending on weekends, holidays, or data availability.

Example request:

```text
https://api.frankfurter.dev/v1/latest?amount=100&from=USD&to=EUR
```

## Deployment

This project is configured for Vercel with `vercel.json`.

Vercel settings:

- Framework: Vite
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: `dist`
- Node.js runtime: `24.x`

Deploy by importing the repository in Vercel, or from the project root:

```bash
vercel
```

For production:

```bash
vercel --prod
```

## Project Structure

```text
.
├── index.html
├── public/
├── src/
│   ├── App.tsx
│   ├── App.css
│   ├── App.test.tsx
│   ├── CurrencyConverter.tsx
│   ├── index.css
│   ├── main.tsx
│   └── setupTests.ts
├── tsconfig.json
├── vercel.json
└── vite.config.ts
```

## Notes

- The app is fully client-side and does not need serverless functions.
- Currency support is intentionally limited to the currencies listed in `src/CurrencyConverter.tsx`.
- Historical dates must be today or earlier.
