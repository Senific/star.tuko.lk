# Beauty 2026 - Sri Lanka's Biggest Online Beauty Contest

🌟 **star.tuko.lk** - Official website for Beauty 2026

## Overview

Beauty 2026 is Sri Lanka's largest online beauty contest, covering all 25 districts and 9 provinces. The competition is fully online, with Tuko app integration for authentication and voting.

## Features

- 🌐 **Trilingual Support**: English, Sinhala (සිංහල), Tamil (தமிழ்)
- 👑 **Multi-tier Competition**: District → Province → National
- 🗳️ **Fair Voting**: One vote per Tuko user per contestant
- 📱 **Tuko Integration**: Authentication via Tuko app
- 📊 **Real-time Leaderboards**: Track rankings by district/province
- 🎨 **Modern Design**: Elegant, responsive UI

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Authentication**: Tuko OAuth (placeholder ready)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development

The site runs at `http://localhost:3000`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── contestants/       # Contestants gallery
│   ├── leaderboard/       # Rankings
│   ├── about/             # About & rules
│   ├── schedule/          # Event timeline
│   ├── register/          # Contestant registration
│   ├── results/           # Competition results
│   └── contact/           # Contact form
├── components/
│   ├── layout/            # Navbar, Footer
│   └── contestants/       # Contestant cards
├── context/
│   ├── AuthContext.tsx    # Tuko authentication
│   └── LanguageContext.tsx # i18n
└── data/
    ├── locations.ts       # Districts & provinces
    ├── translations.ts    # UI translations
    └── mockData.ts        # Sample contestants
```

## Tuko Integration

Authentication is handled through `src/context/AuthContext.tsx`. The placeholder is ready for Tuko OAuth integration.

### To integrate Tuko OAuth:

1. Update the `login` function in `AuthContext.tsx`
2. Implement OAuth callback handling
3. Store session tokens securely

## Voting Rules

- Only Tuko users can vote
- 1 vote per user per contestant
- Votes are island-wide (can vote for any district)
- No paid votes - pure popularity contest

## Timeline

| Phase | Dates |
|-------|-------|
| Registration | Mar 20 - Apr 20, 2026 |
| District Round | Apr 21 - May 21, 2026 |
| Province Round | May 25 - Jun 15, 2026 |
| National Finale | Jun 20 - Jul 6, 2026 |

## Contact

- Website: star.tuko.lk
- Email: info@star.tuko.lk

## License

© 2026 Beauty 2026. All rights reserved.
