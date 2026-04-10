# Admin Template - React Version

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![CI](https://github.com/reeswell/react-admin/actions/workflows/ci.yml/badge.svg)](https://github.com/reeswell/react-admin/actions/workflows/ci.yml)

React 18 + Vite admin dashboard template with Ant Design 5, Zustand, route guards, and theme customization.

Live demo: [https://react-admin-reeswell.vercel.app](https://react-admin-reeswell.vercel.app)

## Looking for Nuxt/Vue version?

This repository is the React implementation.  
For the Nuxt/Vue implementation, see [reeswell/nuxt3-admin](https://github.com/reeswell/nuxt3-admin).

## Features

- Light and dark theme switching
- Tags view tab navigation
- Theme primary color customization
- Route auth guard
- Responsive admin layout
- Mock login flow for demo usage

## Tech Stack

- React 18
- Vite
- Ant Design 5
- Zustand
- React Router 6
- TypeScript

## Quick Start

```bash
pnpm install
pnpm dev
```

App runs at `http://localhost:5173`.

## Build

```bash
pnpm build
pnpm preview
```

## Deploy to Vercel

`vercel.json` includes SPA rewrite rules so deep links are routed to `index.html`.

## Demo Account

- username: `admin`
- password: `admin123`

This account is for local/template demo only.
