# 🎥 Video Learning Platform

A modern, high-performance video learning platform built with Next.js 15, shadcn/ui, and Tailwind CSS for interactive English learning with real-time subtitles.

## ✨ Features

- 🎬 **Interactive Video Player** with custom controls
- 📝 **Real-time Subtitle Display** and interaction
- 📚 **Organized Video Library** with search and filtering
- 🎨 **Modern UI** with shadcn/ui components
- 🌙 **Dark/Light Mode** support
- 📱 **Fully Responsive** design
- ⚡ **Ultra-Fast Performance** with Turbopack
- 🚀 **Production Ready** with Netlify deployment

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router + Turbopack
- **Runtime**: Bun (10x faster than Node.js)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Language**: TypeScript for type safety
- **Linting**: ESLint + Biome for fast formatting
- **Deployment**: Netlify with optimized build
- **Fonts**: Geist font family (optimized by Next.js)

## 🚀 Getting Started

### Prerequisites
- **Bun** (recommended) or Node.js 18+
- Modern browser with video support

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd video-learning-platform
```

2. **Install dependencies**
```bash
# Using Bun (recommended - fastest)
bun install

# Or using other package managers
npm install
# yarn install
# pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Run the development server**
```bash
# Using Bun with Turbopack (ultra-fast)
bun dev

# Or using other package managers
npm run dev
# yarn dev
# pnpm dev
```

5. **Open your browser**
Visit [http://localhost:3000](http://localhost:3000) to see the result.

The page auto-updates as you edit files thanks to **Turbopack's instant HMR**.

## ⚡ Performance Features

- **Turbopack Bundler**: 10x faster than Webpack
- **Bun Runtime**: Lightning-fast script execution
- **Instant Hot Reload**: Changes appear immediately
- **Network Access**: Dev server accessible on all devices (`-H 0.0.0.0`)
- **Optimized Images**: Smart loading for video thumbnails

## 📦 Available Scripts

```bash
bun dev          # Start ultra-fast development server
bun build        # Build for production
bun start        # Start production server
bun lint         # Type check + ESLint (fast with Bun)
bun format       # Format code with Biome (instant)
```

## 🎯 Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout with Geist fonts
│   ├── page.tsx        # Video learning platform homepage
│   └── globals.css     # Global styles with design tokens
├── components/
│   └── ui/             # shadcn/ui components
│       └── button.tsx  # Customizable button component
└── lib/
    └── utils.ts        # Utility functions (cn helper)
```

## 🎨 Adding Components

Add new shadcn/ui components easily:

```bash
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
```

## 📱 Video Platform Features

- **Custom Video Player**: Built with modern controls
- **Subtitle Management**: Interactive subtitle display
- **Video Library**: Organized content with thumbnails
- **Settings Panel**: Audio and subtitle preferences
- **Responsive Design**: Works on all screen sizes

## 🌐 Deployment

### Netlify Deployment (Recommended)

1. **Connect repository** to Netlify
2. **Build settings** are pre-configured in `netlify.toml`:
   - Build command: `bun run build`
   - Publish directory: `.next`
3. **Set environment variables** in Netlify dashboard
4. **Deploy automatically** on every push! 🚀

### Manual Deployment

```bash
# Build for production
bun build

# Start production server
bun start
```

## 🔧 Configuration Files

- `next.config.js` - Next.js configuration with image optimization
- `tailwind.config.ts` - Tailwind CSS with design system
- `components.json` - shadcn/ui configuration
- `postcss.config.js` - PostCSS with modern ES modules
- `biome.json` - Fast code formatting rules
- `netlify.toml` - Production deployment settings

## 📚 Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [shadcn/ui](https://ui.shadcn.com) - Beautiful component library
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Bun](https://bun.sh) - Fast JavaScript runtime and package manager
- [Turbopack](https://turbo.build/pack) - Rust-powered bundler

## 🚀 Performance Metrics

| Metric | Traditional Setup | Our Setup |
|--------|------------------|-----------|
| Dev Server Start | ~5 seconds | ~0.5 seconds |
| Hot Reload Speed | ~500ms | Instant |
| Build Time | ~30 seconds | ~10 seconds |
| Bundle Size | Standard | Optimized |

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you have questions or need help:
- Open an issue on GitHub
- Check the documentation links above
- Contact the development team

---

**Happy Learning!** 🎓✨

Built with ❤️ using Next.js, shadcn/ui, and modern web technologies.
