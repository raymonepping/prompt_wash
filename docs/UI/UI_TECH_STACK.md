# PromptWash UI Technology Stack

The PromptWash frontend is a modern, local-first web application.

## Framework

- React

## Build System

- Vite

## Styling

- Tailwind CSS

## State Management

- Zustand

Primary store domains:

- Workspace state
- Runs
- Experiments
- Intelligence data

## Editor

- Monaco Editor

Used for the raw input panel and prompt editing.

## Graph Visualization

- React Flow

Used in Evolution Lab for prompt lineage.

## Charts

- Recharts

Used for intelligence and experiment results.

## Data Fetching

- TanStack Query

Handles API communication and caching.

## UI Components

- Radix UI primitives

Provides accessible base components.

## Deployment

Local-first deployment.

The frontend is served by the PromptWash backend on `localhost`.
