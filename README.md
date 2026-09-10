# Narrative Visual Analytics Dashboard for Depression and Imaging Metadata

## Project Overview

This project is a narrative visual analytics dashboard focused on depression journeys, comparative exploration, and research-oriented interaction tracking. It is built as a React and TypeScript single-page application with Vite, Tailwind CSS, and shadcn/ui-style components.

The repository includes:

- Narrative pages and case-study flows
- Interactive comparative dashboard views
- Google Analytics event tracking
- Google Apps Script based research logging

## Installation

### Prerequisites

- Node.js 18 or newer
- npm 9 or newer

### Install dependencies

```sh
npm install
```

## Local Development

Start the Vite development server:

```sh
npm run dev
```

By default, the application runs locally on port `8080`.

## Build

Create a production build:

```sh
npm run build
```

To preview the built output locally:

```sh
npm run preview
```

## Deployment

This project produces a static frontend build via Vite. Deploy the generated contents of `dist/` using any static hosting provider or web server that supports client-side routing.

Typical deployment flow:

1. Install dependencies with `npm install`
2. Build the project with `npm run build`
3. Upload the `dist/` directory to your hosting environment
4. Configure route fallback to `index.html` for SPA navigation if required by your host
