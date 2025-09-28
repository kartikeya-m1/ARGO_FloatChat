# 🌊 FloatChat Client - React Frontend

The FloatChat client is a modern React application built with TypeScript, Vite, and Tailwind CSS. It provides a beautiful, responsive interface for exploring ARGO ocean data through AI-powered conversations and interactive visualizations.

## 🎨 Design Features

### 🌊 **Ocean-Themed UI**
- Stunning ocean gradient backgrounds and animations
- Custom color palette inspired by ocean depths
- Smooth wave animations and floating particles
- Professional glass-morphism effects

### ✨ **Interactive Components**
- AI chat interface with real-time responses
- Dynamic data visualizations and charts
- Interactive ocean maps with float positions
- Responsive dashboard with multiple views

### 🚀 **Modern Technology Stack**
- **React 18** with TypeScript for type safety
- **Vite** for ultra-fast development and building
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **React Router** for client-side navigation

## 🚀 Quick Setup

### Prerequisites
- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**

### Installation

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

## 📦 Dependencies

### Core Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.15.0",
  "typescript": "^5.0.2"
}
```

### UI & Styling
```json
{
  "tailwindcss": "^3.3.3",
  "framer-motion": "^10.16.4",
  "lucide-react": "^0.263.1"
}
```

### Data Visualization  
```json
{
  "plotly.js": "^2.26.0",
  "react-plotly.js": "^2.6.0",
  "react-leaflet": "^4.2.1",
  "leaflet": "^1.9.4"
}
```

### Development Tools
```json
{
  "vite": "^4.4.5",
  "@vitejs/plugin-react": "^4.0.3",
  "eslint": "^8.45.0",
  "autoprefixer": "^10.4.15",
  "postcss": "^8.4.29"
}
```

## 🎯 Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors automatically

# Type Checking
npm run type-check   # Run TypeScript compiler check
```

## 🏗️ Project Structure

```
client/
├── public/                 # Static assets
│   ├── index.html         # HTML template
│   └── ocean-icon.svg     # App icon
├── src/
│   ├── components/        # Reusable components
│   │   ├── ChatInterface.tsx
│   │   ├── DataVisualization.tsx
│   │   ├── LoadingScreen.tsx
│   │   ├── MapView.tsx
│   │   └── MetricsPanel.tsx
│   ├── pages/            # Page components
│   │   ├── LandingPage.tsx
│   │   └── Dashboard.tsx
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript type definitions
│   ├── animations/       # Animation configurations
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # App entry point
│   └── index.css         # Global styles
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.ts        # Vite configuration
└── tsconfig.json         # TypeScript configuration
```

## 🎨 Styling System

### Ocean Color Palette
```css
/* Ocean Blues */
ocean-50: #f0f9ff    /* Lightest blue */
ocean-400: #38bdf8   /* Primary blue */
ocean-600: #0284c7   /* Medium blue */
ocean-900: #0c4a6e   /* Deep ocean */

/* Coral Accents */
coral-400: #fb7185   /* Coral pink */
coral-600: #e11d48   /* Deep coral */

/* Deep Sea */
deep-700: #334155    /* Dark gray-blue */
deep-900: #0f172a    /* Deepest dark */
```

### Custom Animations
```css
/* Wave animation */
.animate-wave { animation: wave 3s ease-in-out infinite; }

/* Floating elements */
.animate-float { animation: float 6s ease-in-out infinite; }

/* Ocean current effect */
.animate-current { animation: current 8s linear infinite; }
```

### Glass Morphism Effect
```css
.glass-morphism {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

## 🧩 Key Components

### 🏠 **LandingPage**
- Hero section with animated ocean background
- Feature showcase cards
- Navigation to dashboard
- Responsive design for all screen sizes

### 💬 **ChatInterface** 
- Real-time AI conversation interface
- Message bubbles with animations
- Suggested query buttons
- Loading states with ocean-themed spinners

### 📊 **DataVisualization**
- Interactive temperature/salinity charts
- Switchable chart types and time ranges
- Animated data loading
- Export capabilities

### 🗺️ **MapView**
- Interactive ocean map with float positions
- Layer switching (temperature, salinity, bathymetry)
- Float details sidebar
- Zoom and pan controls

### 📈 **MetricsPanel**
- System performance metrics
- Recent activity feed
- Data quality indicators
- Real-time updates

### ⏳ **LoadingScreen**
- Stunning ocean splash screen
- Animated bubbles and waves
- Progressive loading indicators
- Smooth transitions

## 🌐 API Integration

### Base Configuration
```typescript
// Configure API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// API endpoints
const endpoints = {
  chat: '/api/v1/chat/query',
  floats: '/api/v1/data/floats',
  profiles: '/api/v1/data/profiles/region',
  stats: '/api/v1/data/stats'
}
```

### Example API Calls
```typescript
// Chat with AI
const response = await fetch(`${API_BASE_URL}/api/v1/chat/query`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    message: "Show me temperature profiles in the Pacific",
    context: {}
  })
})

// Fetch ARGO data
const floats = await fetch(`${API_BASE_URL}/api/v1/data/floats`)
const data = await floats.json()
```

## 🔧 Development

### Environment Variables

Create `.env.local` file:
```bash
# API Configuration
VITE_API_URL=http://localhost:8000

# Feature Flags
VITE_ENABLE_AI_CHAT=true
VITE_ENABLE_MAP_VIEW=true
VITE_ENABLE_ANIMATIONS=true

# Development
VITE_DEBUG_MODE=true
```

### Hot Reload Development

```bash
# Start with hot reload
npm run dev

# The app will automatically reload when you make changes
# Check console for any TypeScript or linting errors
```

### Building for Production

```bash
# Create optimized production build
npm run build

# Preview the production build
npm run preview

# Build files will be in dist/ directory
```

## 🎭 Animation System

### Framer Motion Integration

```typescript
// Page transitions
<AnimatePresence mode="wait">
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    transition={{ duration: 0.5 }}
  >
    <Dashboard />
  </motion.div>
</AnimatePresence>

// Staggered animations
{items.map((item, index) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    {item.content}
  </motion.div>
))}
```

### CSS Animations

```css
/* Ocean wave keyframes */
@keyframes wave {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}

/* Floating elements */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Bubble animation */
@keyframes bubble {
  0% { transform: translateY(100vh) scale(0); }
  100% { transform: translateY(-100vh) scale(1); }
}
```

## 📱 Responsive Design

### Breakpoint System
```css
/* Tailwind CSS breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktop */
2xl: 1536px /* Large screens */
```

### Mobile-First Approach
```tsx
// Example responsive component
<div className="
  flex flex-col          // Mobile: stack vertically
  md:flex-row           // Tablet+: horizontal layout
  lg:gap-8              // Laptop+: larger spacing
  xl:max-w-7xl          // Desktop+: max width
">
  <div className="
    w-full               // Mobile: full width
    md:w-2/3            // Tablet+: 2/3 width
    lg:w-3/4            // Laptop+: 3/4 width
  ">
    Main content
  </div>
  <div className="
    w-full               // Mobile: full width
    md:w-1/3            // Tablet+: 1/3 width
    lg:w-1/4            // Laptop+: 1/4 width
  ">
    Sidebar
  </div>
</div>
```

## 🧪 Testing

### Component Testing
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

### Example Test
```typescript
import { render, screen } from '@testing-library/react'
import { ChatInterface } from './ChatInterface'

test('renders chat interface', () => {
  render(<ChatInterface />)
  
  expect(screen.getByPlaceholderText(/ask me about ocean data/i))
    .toBeInTheDocument()
  
  expect(screen.getByText(/ai ocean data assistant/i))
    .toBeInTheDocument()
})
```

## 🚀 Performance Optimization

### Code Splitting
```typescript
// Lazy load components
const Dashboard = lazy(() => import('./pages/Dashboard'))
const MapView = lazy(() => import('./components/MapView'))

// Wrap in Suspense
<Suspense fallback={<LoadingScreen />}>
  <Dashboard />
</Suspense>
```

### Image Optimization
```typescript
// Use modern image formats
<img 
  src="/ocean-hero.webp" 
  alt="Ocean background"
  loading="lazy"
  className="w-full h-screen object-cover"
/>
```

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

## 🔧 Deployment

### Static Site Deployment

#### Netlify
```bash
# Build command
npm run build

# Publish directory
dist

# Environment variables
VITE_API_URL=https://your-api.com
```

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in dashboard
```

#### GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json
"homepage": "https://username.github.io/floatchat",
"scripts": {
  "deploy": "gh-pages -d dist"
}

# Deploy
npm run build && npm run deploy
```

## 🤝 Contributing

### Development Workflow

1. **Setup Development Environment**
   ```bash
   git clone <repository-url>
   cd client
   npm install
   npm run dev
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-ui-feature
   ```

3. **Development Guidelines**
   - Follow TypeScript best practices
   - Use Tailwind utility classes
   - Implement responsive design
   - Add Framer Motion animations
   - Test on multiple screen sizes

4. **Code Quality**
   ```bash
   npm run lint          # Check for errors
   npm run type-check    # TypeScript validation
   npm run build         # Ensure it builds
   ```

5. **Submit Pull Request**
   - Clear description of changes
   - Screenshots for UI changes
   - Responsive design verification

### Coding Standards

- **TypeScript**: Strict mode enabled, all props typed
- **Components**: Functional components with hooks
- **Styling**: Tailwind classes, custom CSS for animations
- **Naming**: PascalCase for components, camelCase for functions
- **Files**: `.tsx` for components, `.ts` for utilities

---

**Ready to dive into ocean data exploration? Start the development server and make some waves! 🌊**