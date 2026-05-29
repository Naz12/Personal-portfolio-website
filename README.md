# Nazrawi Solomon Abera - Personal Portfolio

A modern, responsive personal portfolio website built with Next.js 14, Tailwind CSS, and shadcn/ui components.

## Features

- Modern, responsive design with mobile-first approach
- Dark/Light mode toggle
- Smooth animations with Framer Motion
- Work experience timeline section
- Resend-powered contact form
- SEO optimized (metadata, sitemap, robots.txt)
- Built with Next.js 14 and TypeScript
- Styled with Tailwind CSS and shadcn/ui

## Sections

- **Hero Section**: Professional introduction with call-to-action buttons
- **About Section**: Skills, education, and personal information
- **Experience Section**: Work history and achievements
- **Projects Section**: Showcase of featured projects with GitHub links
- **Contact Section**: Contact form and social media links

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Animations**: Framer Motion
- **Email**: Resend
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Configure `.env.local`:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Your production URL (e.g. `https://yourdomain.com`) |
| `RESEND_API_KEY` | API key from [Resend](https://resend.com) |
| `CONTACT_TO_EMAIL` | Email address that receives contact form messages |
| `CONTACT_FROM_EMAIL` | Verified sender address in Resend |

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Customization

Update personal information in `lib/constants.ts`:

- Personal details (name, email, location)
- Skills and technologies
- Projects and experience
- Education information

### Asset checklist

Replace these placeholder files in `public/` before or after launch:

| File | Purpose |
|------|---------|
| `public/resume.pdf` | Your resume (download buttons link here) |
| `public/og-image.png` | Social sharing image (1200x630) |
| `public/profile.jpg` | Profile photo (optional, hero uses initials fallback) |
| `public/projects/*.jpg` | Project screenshots (optional) |

## Deployment

Deploy to [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SITE_URL`
   - `RESEND_API_KEY`
   - `CONTACT_TO_EMAIL`
   - `CONTACT_FROM_EMAIL`
4. Deploy

### Resend setup

1. Create a [Resend](https://resend.com) account
2. Add and verify your sending domain (or use Resend's onboarding domain for testing)
3. Create an API key and add it to your environment variables
4. Set `CONTACT_FROM_EMAIL` to an address on your verified domain

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## License

This project is open source and available under the [MIT License](LICENSE).
