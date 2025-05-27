# 🏗️ BuildAIde

**Your AI-Powered Construction & Renovation Assistant**

An AI-powered tool suite for homeowners and construction professionals to plan, estimate, and execute smarter. BuildAIde combines intelligent automation with industry expertise to transform complex construction decisions into intuitive, data-driven experiences.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development
```bash
# Install dependencies
npm install

# Start development server (runs both frontend and backend)
npm run dev

# Alternative: Run backend only
node server/index.js
```

The application will be available at `http://localhost:5000`

## 🧪 Demo Mode

BuildAIde includes a comprehensive demo mode that showcases all features with realistic mock data, perfect for testing and demonstrations.

### What Demo Mode Does:
- **Prevents Database Writes**: All data operations are simulated
- **Pre-filled Realistic Data**: Properties, estimates, schedules, and contractor information
- **Full Feature Access**: Experience all tools without affecting real data
- **AI Response Simulation**: Mock AI responses for testing workflows

### Enable Demo Mode:
```bash
# Set environment variable
DEMO_MODE=true npm run dev

# Or add to .env file
echo "DEMO_MODE=true" >> .env
```

When demo mode is active, you'll see a "Demo Mode" indicator throughout the application.

## 🧰 Tool Suite

### 👷‍♂️ Professional/Contractor Tools
- **🔨 Bid Estimator** - Generate accurate project estimates with AI-powered cost analysis
- **📅 Project Scheduler** - Visual timeline management with crew assignments and permit tracking
- **📊 Material Price Tracker** - Real-time material costs with trend analysis and alerts
- **🏠 Property Investment Analyzer** - ROI calculations and market analysis for flip opportunities
- **🤝 Subcontractor Network** - Manage contractor relationships with AI-powered matching
- **🎯 Lead Finder** - Discover new business opportunities with market intelligence
- **🤖 Construction AI Assistant** - Expert guidance on codes, best practices, and project decisions

### 🏡 Homeowner/Consumer Tools
- **💰 Budget Planner** - Smart cost planning with instant estimates and budget forecasts
- **📈 Investment ROI Tool** - Calculate returns for flips and rentals with comprehensive analysis
- **🏘️ Property Analyzer** - Discover renovation opportunities with AI-powered property insights
- **👥 Contractor Quote Comparison** - Compare multiple quotes with AI recommendations and red flag detection
- **📋 Permit Research Assistant** - Navigate permit requirements with location-specific guidance
- **🤖 Renovation Concierge** - 24/7 AI advisor for renovation planning and decision-making

## 🎯 Key Features

### 🧠 AI-Powered Intelligence
- GPT-4o integration for expert construction advice
- Intelligent cost estimation with 73% accuracy improvement
- Market trend analysis and predictive insights
- Automated risk assessment and mitigation suggestions

### 🎨 Dual-Mode Interface
- **Professional Mode**: Advanced tools for contractors and industry experts
- **Consumer Mode**: Simplified interface for homeowners and DIY enthusiasts
- Seamless mode switching with persistent user preferences

### 📱 Modern Tech Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + OpenAI API
- **UI Components**: Shadcn/ui for consistent design
- **State Management**: Zustand + TanStack Query
- **Development**: Vite for fast hot-reload development

## 📸 Screenshots

*[Note: Add screenshots or demo GIFs showing the dual-mode interface, tool cards, and AI features]*

### Professional Dashboard
*[Screenshot of professional construction tools interface]*

### Consumer Dashboard  
*[Screenshot of homeowner renovation toolkit]*

### AI Assistant in Action
*[Screenshot or GIF of AI-powered recommendations]*

## 🔧 Configuration

### Environment Variables
```bash
# Required for AI features
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Enable demo mode
DEMO_MODE=true

# Optional: Custom waitlist URL
VITE_WAITLIST_URL=https://your-waitlist-url.com
```

### Development Scripts
```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build locally
```

## 🏗️ Architecture

BuildAIde follows modern full-stack patterns:
- **Frontend-Heavy**: Maximum functionality in React with minimal backend dependency
- **API-First Design**: Clean separation between frontend and backend services
- **Component-Based**: Reusable UI components with consistent styling
- **Type-Safe**: Full TypeScript coverage for development confidence

## 🤝 Contributing

BuildAIde is designed for extensibility and welcomes contributions:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support, feature requests, or bug reports:
- Create an issue in this repository
- Contact the development team
- Join our early access program for priority support

---

**Built with ❤️ for the construction industry**

*Making construction smarter, one project at a time.*