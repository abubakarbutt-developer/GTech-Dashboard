# Professional Dashboard Analytics

A stunning, modern analytics dashboard built with React.js, TypeScript, and Vite. Features a premium dark theme with glassmorphism effects, interactive charts, and real-time metrics.

## ✨ Features

- **📊 Interactive Charts**: Beautiful area charts powered by Recharts
- **📈 Real-time Metrics**: Dynamic stat cards with trend indicators
- **🎨 Premium Design**: Dark theme with glassmorphism and gradient effects
- **⚡ Smooth Animations**: Micro-interactions and transitions throughout
- **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile
- **🎯 Activity Feed**: Timeline-based activity tracking with icons
- **🚀 Fast Performance**: Built with Vite for lightning-fast development

## 🎨 Design Highlights

- **Dark Mode Aesthetic**: Professional dark theme with vibrant accent colors
- **Glassmorphism Effects**: Modern frosted glass card designs
- **Custom Gradients**: Eye-catching gradient overlays and backgrounds
- **Animated Background**: Subtle pulsing radial gradients
- **Hover Effects**: Interactive elements with smooth transitions
- **Custom Scrollbar**: Styled scrollbars matching the theme

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Recharts** - Chart library
- **Lucide React** - Icon library
- **CSS3** - Custom styling with CSS variables

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Installation

The project is already set up! Just run:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The dashboard will be available at `http://localhost:5173/`

### Build for Production

Create an optimized production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── StatCard.tsx          # Metric cards with icons
│   ├── StatCard.css
│   ├── ChartCard.tsx          # Chart components
│   ├── ChartCard.css
│   ├── ActivityFeed.tsx       # Activity timeline
│   └── ActivityFeed.css
├── App.tsx                    # Main application
├── App.css                    # App-specific styles
├── index.css                  # Global styles & design system
└── main.tsx                   # Entry point
```

## 🎨 Customization

### Color Palette

The dashboard uses CSS variables for easy customization. Edit `src/index.css`:

```css
:root {
  --accent-primary: #6366f1;
  --accent-secondary: #8b5cf6;
  --accent-success: #10b981;
  --accent-warning: #f59e0b;
  --accent-danger: #ef4444;
  --accent-info: #06b6d4;
}
```

### Adding New Metrics

Add new stat cards in `App.tsx`:

```tsx
<StatCard
  title="Your Metric"
  value="1,234"
  change={5.2}
  icon={YourIcon}
  gradient="linear-gradient(135deg, #color1 0%, #color2 100%)"
/>
```

### Custom Charts

Create new charts by modifying the data arrays in `App.tsx`:

```tsx
const customData = [
  { name: 'Label', value: 100 },
  // ... more data points
];
```

## 📊 Dashboard Components

### Stat Cards
- Display key metrics with trend indicators
- Animated icons with hover effects
- Positive/negative change indicators
- Glassmorphism card design

### Charts
- Responsive area charts
- Custom gradient fills
- Interactive tooltips
- Smooth animations

### Activity Feed
- Timeline-based layout
- Icon indicators for each activity
- Relative timestamps
- Hover interactions

## 🌟 Key Features Explained

### Glassmorphism
Cards use backdrop blur and semi-transparent backgrounds for a modern frosted glass effect.

### Animations
- Fade-in animations on component mount
- Slide-in effects for header elements
- Hover transitions on interactive elements
- Staggered animations in activity feed

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Breakpoints at 768px and 480px
- Touch-friendly interface

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to customize and extend this dashboard for your needs!

---

Built with ❤️ using React and modern web technologies
# GTech-Dashboard
# GTech-Dashboard
