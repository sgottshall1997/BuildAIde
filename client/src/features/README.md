# Features Directory Structure

## Overview
This directory contains feature-based modules for ConstructionSmartTools. Each feature is self-contained with its own components, hooks, types, and utilities.

## Feature Structure Pattern
```
features/
├── [feature-name]/
│   ├── components/          # Feature-specific components
│   ├── hooks/              # Feature-specific hooks
│   ├── types/              # TypeScript types for this feature
│   ├── utils/              # Feature-specific utilities
│   ├── constants/          # Feature constants
│   └── index.ts            # Public API exports
```

## Features

### Core Business Features
- **project-management** - Dashboard, project tracking, scheduling
- **cost-estimation** - Bid estimators, cost calculators, pricing
- **material-intelligence** - Material prices, trends, market data
- **property-analysis** - Real estate listings, ROI, flipping tools
- **ai-assistant** - All AI-powered features and chat interfaces

### User Experience Features
- **onboarding** - User guidance, tutorials, first-time experience
- **feedback** - User feedback systems, ratings, surveys
- **authentication** - User management, demo mode, permissions

### Shared Infrastructure
- **shared** - Reusable components, utilities, types
- **ui** - Base UI components (moved from components/ui)