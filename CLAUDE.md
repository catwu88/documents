# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a DMO (Destination Management Organization) CMS demo project featuring a React-based admin panel for managing local businesses and events. The system demonstrates a comprehensive destination management solution with business listings, event management, and analytics capabilities.

## Key Commands

### Development Commands
Working directory for all commands: Root directory (contains package.json)

- **Start development server**: `npm run dev` (serves on http://localhost:5173)
- **Build project**: `npm run build` (runs TypeScript compilation then Vite build)
- **Lint code**: `npm run lint`
- **Preview production build**: `npm run preview`

### Login Credentials
- Username: `admin`
- Password: `admin123`

## Architecture Overview

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: Ant Design 5.x with Chinese/English/Japanese localization
- **Routing**: React Router v7
- **Maps**: Leaflet with OpenStreetMap
- **Charts**: Recharts for data visualization
- **State Management**: React Context (LanguageContext)
- **Mock Data**: All data is simulated in `src/data/mockData.ts`

### Project Structure
```
/documents/ (project root)
├── README.md                          # Main project documentation
├── CLAUDE.md                          # Development guidance for Claude Code
├── admin-panel-README.md              # Original admin panel documentation
├── package.json                       # Node.js dependencies and scripts
├── vite.config.ts                     # Vite build configuration
├── tsconfig.json                      # TypeScript configuration
├── eslint.config.js                   # ESLint configuration
├── index.html                         # Main HTML entry point
├── docs/                              # Architecture and design documentation
│   ├── dmo_backend_architecture.md
│   ├── dmo_cms_architecture.md
│   ├── dmo_cms_prd.md
│   ├── dmo_frontend_architecture.md
│   └── dmo_user_journey.md
├── src/                               # React application source code
│   ├── components/
│   │   ├── Layout/Layout.tsx          # Main application layout with sidebar
│   │   └── Map/OpenStreetMap.tsx      # Map component for business locations
│   ├── contexts/
│   │   └── LanguageContext.tsx        # Multi-language support (zh/en/ja)
│   ├── data/
│   │   └── mockData.ts                # All mock data (businesses, events, metrics)
│   ├── pages/                         # Page components for each main feature
│   │   ├── Analytics/                 # Data visualization and reports
│   │   ├── BatchUpload/               # Excel upload functionality
│   │   ├── Business/                  # Business management (list/detail)
│   │   ├── Categories/                # Category management
│   │   ├── Dashboard/                 # Main dashboard with metrics
│   │   ├── Event/                     # Event management (list/detail)
│   │   ├── Labels/                    # Tag management
│   │   └── Login/                     # Authentication page
│   ├── types/index.ts                 # TypeScript type definitions
│   ├── App.tsx                        # Root component with routing
│   └── main.tsx                       # Application entry point
└── public/                            # Static assets
    └── vite.svg
```

### Core Data Models
- **Business**: Commercial entities with status workflow (pending → approved → published)
- **Event**: Activities with date ranges and business associations
- **Analytics**: Performance metrics for businesses and events
- **User**: Authentication and role-based access

### Key Features
1. **Business Management**: Full CRUD with status workflows, photo management, Excel batch upload
2. **Event Management**: Calendar-based events with geofencing and business associations
3. **Analytics Dashboard**: Real-time metrics, charts, and performance tracking
4. **Multi-language Support**: Chinese (default), English, Japanese with Ant Design locales
5. **Interactive Maps**: Leaflet integration for location visualization

## Development Guidelines

### File Organization
- Place new business logic in appropriate `pages/` subdirectories
- Shared components go in `components/`
- Add new data types to `types/index.ts`
- Extend mock data in `data/mockData.ts` following existing patterns

### State Management
- Uses React Context for language settings
- Local state management with useState/useEffect
- No external state management library (Redux/Zustand)

### API Integration
- Currently uses mock data with Promise-based simulation
- All API calls use setTimeout to simulate network latency
- Authentication uses localStorage for token persistence

### Styling
- Ant Design components with default theme
- CSS modules for component-specific styles
- Responsive design considerations built into layout

### Testing
- No existing test setup, but project supports standard React testing approaches
- TypeScript provides compile-time validation

## Important Notes

- This is a demo project with no real backend - all data is mocked
- Data changes are not persisted between browser sessions
- Some features show "功能開發中" (under development) placeholders
- All text content is primarily in Traditional Chinese with multi-language UI controls