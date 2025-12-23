# Kanban Board

A modern, feature-rich Kanban board application built with React 19, TypeScript, and Tailwind CSS. Manage your tasks with drag-and-drop functionality, sorting, and search capabilities.

![Kanban Board](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![Vite](https://img.shields.io/badge/Vite-7.2-purple)

## Features

- ✅ **List Management**: Create, rename, and delete lists
- ✅ **Task Management**: Add, edit, and delete tasks with name and description
- ✅ **Drag & Drop**: Move tasks between lists using intuitive drag-and-drop
- ✅ **Sort Tasks**: Sort tasks alphabetically within each list
- ✅ **Search Filter**: Search across all tasks in all lists
- ✅ **Dark Mode**: Automatic dark/light theme support

## Tech Stack

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS v4** - Utility-first styling
- **@dnd-kit** - Powerful drag-and-drop library
- **Vitest** - Fast unit testing framework
- **React Testing Library** - User-centric testing

## Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

## Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd kanban
```

2. **Install dependencies**

```bash
pnpm install
# or
npm install
```

## Getting Started

### Development Mode

Start the development server:

```bash
pnpm dev
# or
npm run dev
```

The application will be available at `http://localhost:5173/`

### Build for Production

Create an optimized production build:

```bash
pnpm build
# or
npm run build
```

### Preview Production Build

Preview the production build locally:

```bash
pnpm preview
# or
npm run preview
```

## Running Tests

Run the test suite:

```bash
pnpm test
# or
npm test
```

Run tests in watch mode:

```bash
pnpm test:watch
# or
npm run test:watch
```

Run tests with coverage:

```bash
pnpm test:coverage
# or
npm run test:coverage
```

Built with ❤️ using React, TypeScript, and Tailwind CSS
