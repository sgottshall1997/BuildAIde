# BuildAIde - AI-Powered Construction & Renovation Assistant

## Overview

BuildAIde is a comprehensive AI-powered construction and renovation assistant designed to serve both homeowners and construction professionals. The application provides intelligent automation combined with industry expertise to simplify complex construction planning, estimation, and project management tasks.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: React Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with JSON responses
- **File Upload**: Multer for handling multipart form data
- **Session Management**: Express sessions with PostgreSQL storage

### Database & ORM
- **Database**: PostgreSQL (configured via Drizzle)
- **ORM**: Drizzle ORM for type-safe database operations
- **Migrations**: Drizzle Kit for schema management
- **Storage**: Memory storage fallback for development

## Key Components

### Dual-Mode Interface
- **Consumer Mode**: Simplified interface for homeowners with guided workflows
- **Professional Mode**: Advanced tools for contractors and construction professionals
- **Unified Layout**: Consistent navigation and branding across modes

### AI Integration
- **Provider**: OpenAI GPT-4o for intelligent responses and analysis
- **Features**: Cost estimation, project recommendations, risk assessment
- **Response Handling**: Unified formatting with JSON and markdown parsing
- **Error Handling**: Graceful degradation with fallback responses

### Core Tools Suite
- **Smart Project Estimator**: AI-powered cost calculations with regional pricing
- **Renovation Concierge**: Guided project planning with personalized recommendations
- **Permit Research**: Automated permit requirements lookup by location
- **Material Price Tracker**: Real-time pricing data with trend analysis
- **Schedule Builder**: Project timeline management with conflict detection
- **Bid Generator**: Professional proposal creation with AI enhancement

### Demo Mode System
- **Purpose**: Full-featured demonstrations without database persistence
- **Implementation**: Middleware intercepts write operations
- **Data**: Realistic mock responses for all features
- **Indicators**: Clear visual feedback when in demo mode

## Data Flow

### Request Pipeline
1. Client request → Express middleware → Demo mode check
2. API route handlers → Business logic → Database operations
3. AI processing (if required) → Response formatting
4. JSON response → Client state management → UI updates

### Database Schema
- **Estimates**: Project cost breakdowns with detailed metadata
- **Schedules**: Timeline management with resource allocation
- **Materials**: Pricing data with historical trends
- **Sessions**: User session persistence

### AI Workflow
- **Input Validation**: Sanitize and structure user inputs
- **Prompt Engineering**: Context-aware prompts for specific use cases
- **Response Processing**: Parse AI responses into structured data
- **Error Recovery**: Fallback strategies for AI service failures

## External Dependencies

### Core Dependencies
- **OpenAI API**: Primary AI service for intelligent features
- **Neon Database**: PostgreSQL hosting and connection pooling
- **Cheerio**: HTML parsing for web scraping capabilities
- **Date-fns**: Date manipulation and formatting utilities

### Development Tools
- **TypeScript**: Type safety and developer experience
- **ESBuild**: Fast JavaScript bundling for production
- **Drizzle Kit**: Database schema management and migrations
- **TSX**: TypeScript execution for development

### UI & Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Class Variance Authority**: Type-safe component variants
- **Lucide React**: Consistent icon library

## Deployment Strategy

### Production Build
- **Frontend**: Vite builds optimized static assets to `/dist/public`
- **Backend**: ESBuild bundles server code to `/dist/index.js`
- **Assets**: Static files served from Express with proper caching

### Environment Configuration
- **VITE_DEMO_MODE**: Enable/disable demo mode globally
- **VITE_WAITLIST_URL**: Typeform integration for user signups
- **VITE_RELEASE_MODE**: Hide unfinished features in production
- **OPENAI_API_KEY**: Required for AI functionality
- **DATABASE_URL**: PostgreSQL connection string

### Replit Integration
- **Modules**: Node.js 20, Web, PostgreSQL 16
- **Development**: `npm run dev` for hot-reload development
- **Production**: `npm run build && npm run start`
- **Deployment**: Autoscale deployment target with proper build pipeline

## Changelog

- June 26, 2025: Secured development partnership with experienced construction tech developer (Tenna background)
- June 26, 2025: Established milestone-based development plan focusing on bug fixes, UX optimization for seniors, and authentication
- June 25, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.