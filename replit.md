# BuildAIde - AI-Powered Construction & Renovation Assistant

## Overview

BuildAIde is a comprehensive full-stack web application that serves as an AI-powered construction and renovation planning tool. The platform offers dual modes - a consumer-facing interface for homeowners and a professional interface for contractors and construction professionals. The application combines intelligent cost estimation, project planning, permit research, and AI-driven insights to streamline construction project management.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (@tanstack/react-query) for server state, React hooks for local state
- **UI Framework**: shadcn/ui components built on Radix UI primitives with Tailwind CSS
- **Styling**: Tailwind CSS with CSS variables for theming support

### Backend Architecture
- **Runtime**: Node.js with TypeScript (TSX for development)
- **Framework**: Express.js server with custom middleware
- **API Design**: RESTful endpoints with JSON responses
- **File Structure**: Modular service-based architecture with separate concerns

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Centralized schema definitions in shared directory
- **Development Storage**: In-memory storage implementation for rapid development
- **Cloud Database**: Neon serverless PostgreSQL for production

### Authentication and Authorization Mechanisms
- **Current Implementation**: Session-based authentication placeholder
- **Demo Mode**: Comprehensive demo system that simulates all features without database writes
- **Access Control**: Role-based access with consumer/professional mode separation

## Key Components

### AI Integration
- **Provider**: OpenAI GPT-4o integration for intelligent insights
- **Services**: 
  - Cost estimation explanations
  - Project recommendations  
  - Risk assessments
  - Email drafting assistance
  - Market analysis

### Cost Engine
- **Regional Pricing**: Maryland-focused with ZIP code-based multipliers
- **Material Pricing**: Real-time material cost tracking and forecasting
- **Project Types**: Kitchen, bathroom, and general renovation cost models
- **Breakdown Analysis**: Detailed labor, materials, permits, and overhead calculations

### Demo System
- **Mode Detection**: Environment variable and URL parameter support
- **Data Simulation**: Comprehensive mock data for all features
- **Database Prevention**: Middleware to prevent writes in demo mode
- **User Experience**: Seamless demo experience with realistic data

### Professional Tools Suite
- Project Estimator with AI insights
- Bid Generator with professional templates
- Schedule Builder with conflict detection
- Subcontractor Management
- Lead Management and Finding
- Material Price Tracking
- Expense Tracking

### Consumer Tools Suite
- Renovation Concierge (guided project planning)
- Budget Planner with ROI calculations
- Permit Research tool
- Contractor Comparison
- AI Chat Assistant for homeowner questions

## Data Flow

1. **User Input**: Forms capture project details, preferences, and requirements
2. **Processing**: Cost engine calculates estimates using regional data and material prices
3. **AI Enhancement**: OpenAI API provides intelligent insights and explanations
4. **Storage**: Drizzle ORM handles database operations (or demo mode simulation)
5. **Presentation**: React components render results with interactive visualizations
6. **Export**: PDF generation and email capabilities for sharing results

## External Dependencies

### Core Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: drizzle-orm with drizzle-kit for migrations
- **AI**: OpenAI API for intelligent features
- **UI**: @radix-ui components with class-variance-authority
- **Forms**: react-hook-form with @hookform/resolvers
- **HTTP**: Native fetch API for client-server communication

### Development Tools
- **Build**: Vite with React plugin and TypeScript support
- **Styling**: Tailwind CSS with PostCSS
- **Type Safety**: TypeScript with strict configuration
- **Code Quality**: ESBuild for production bundling

### External Services
- **Waitlist**: Typeform integration for email collection
- **Material Prices**: Web scraping with Cheerio for market data
- **Permits**: Mock data with city-specific permit information

## Deployment Strategy

### Replit Deployment
- **Platform**: Replit with autoscale deployment target
- **Build Command**: `npm run build` (Vite build + ESBuild server bundling)
- **Start Command**: `npm run start` (production mode)
- **Development**: `npm run dev` (concurrent frontend/backend development)

### Environment Configuration
- **Demo Mode**: `VITE_DEMO_MODE` for frontend, `DEMO_MODE` for backend
- **AI Features**: `OPENAI_API_KEY` for GPT integration
- **Database**: `DATABASE_URL` for PostgreSQL connection
- **Waitlist**: `VITE_WAITLIST_URL` for email collection
- **Release Mode**: `VITE_RELEASE_MODE` to hide unfinished features

### Performance Considerations
- **Caching**: React Query for client-side caching with 5-minute stale time
- **Bundle Optimization**: Vite's built-in optimizations with code splitting
- **Database**: Connection pooling with Neon serverless PostgreSQL
- **Demo Mode**: Prevents unnecessary database calls in demonstration scenarios

## Changelog
- June 25, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.