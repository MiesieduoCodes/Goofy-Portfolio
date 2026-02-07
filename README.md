# Miesieduo Veria Digital Studio

A modern portfolio website built with Next.js, TypeScript, and Tailwind CSS, showcasing multi-disciplinary creative work in web development, game development, photography, and music production.

## 🚀 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui with Radix UI primitives
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Inter & Space Grotesk (Google Fonts)
- **Build Tool**: Next.js with SWC
- **Deployment**: Ready for Vercel, Netlify, or any Node.js hosting

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Home page
│   ├── about/page.tsx     # About page
│   ├── work/page.tsx      # Portfolio page
│   ├── services/page.tsx  # Services page
│   ├── contact/page.tsx   # Contact page
│   ├── photography/page.tsx # Photography portfolio
│   ├── music/page.tsx      # Music production page
│   ├── game-dev/page.tsx  # Game development page
│   ├── not-found.tsx      # 404 page
│   └── globals.css        # Global styles
├── src/
│   ├── components/
│   │   ├── layout/        # Layout components (Navbar, Footer)
│   │   ├── sections/       # Page sections (Hero, Stats, etc.)
│   │   └── ui/            # shadcn/ui components
│   └── assets/            # Static assets (moved to public/)
├── public/                # Static assets (images, icons)
├── next.config.js         # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd veria-digital-studio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Run TypeScript type checking
- `npm run analyze` - Analyze bundle size
- `npm run preview` - Build and preview production app
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI

## 🎨 Features

### ✅ Implemented
- **Modern Next.js Architecture**: App Router with TypeScript
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark Theme**: Custom dark theme with lime green accents
- **Interactive Components**: Smooth animations with Framer Motion
- **Optimized Images**: Next.js Image component with WebP/AVIF support
- **SEO Optimized**: Complete metadata and structured data
- **Performance**: SWC compilation, optimized builds
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation

### 🎯 Pages
- **Home**: Hero section, services overview, featured work, stats, CTA
- **About**: Professional background, skills, experience timeline
- **Work**: Portfolio showcase with filtering
- **Services**: Service offerings with detailed descriptions
- **Contact**: Contact form and information
- **Photography**: Photography portfolio with categories
- **Music**: Music production showcase
- **Game Development**: Game dev portfolio and services

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Netlify
1. Run `npm run build`
2. Deploy the `.next` folder to Netlify
3. Use the provided `netlify.toml` configuration

### Other Hosting
1. Run `npm run build`
2. Deploy the `.next` folder
3. Start with `npm start`

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file with:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Miesieduo Veria Digital Studio
```

### Customization
- **Colors**: Modify CSS variables in `app/globals.css`
- **Fonts**: Update font imports in `app/layout.tsx`
- **Content**: Edit page content in respective `app/*/page.tsx` files
- **Components**: Modify components in `src/components/`

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Core Web Vitals**: Optimized for LCP, FID, CLS
- **Bundle Size**: Optimized with Next.js bundle analyzer
- **Images**: Automatic optimization with WebP/AVIF formats

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

- **Portfolio**: [miesieduo.veria](https://miesieduo.veria)
- **Email**: hello@miesieduo.veria
- **LinkedIn**: [linkedin.com/in/miesieduo-veria](https://linkedin.com/in/miesieduo-veria)

---

Built with ❤️ by [Miesieduo Veria](https://miesieduo.veria)
# Achievement trigger

