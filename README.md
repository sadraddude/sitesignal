# Website Analyzer Pro - SaaS Business Website Analysis Tool

Website Analyzer Pro is a comprehensive SaaS platform that helps web designers and agencies find potential clients by identifying businesses with outdated websites. The platform provides detailed website analysis, design age evaluation, and AI-powered redesign capabilities.

## Features

### Core Features
- **Business Search**: Find businesses by location and industry
- **Website Analysis**: Evaluate website quality using Google Lighthouse
- **Design Age Analysis**: Determine how modern or outdated a website looks
- **AI Redesign**: Generate modern website redesigns with one click
- **Lead Management**: Save and organize potential clients

### Business Features
- **User Authentication**: Secure login and registration
- **Subscription Plans**: Tiered pricing with different feature sets
- **Dashboard**: Analytics and quick access to key features
- **Export & Reporting**: Generate and download detailed reports
- **Team Collaboration**: Work with team members (Agency plan)

## Technology Stack

- **Frontend**: Next.js 14 with App Router, React, TypeScript
- **UI Components**: shadcn/ui, Tailwind CSS
- **APIs**: Google Places API, PageSpeed Insights API
- **AI Integration**: OpenAI for design analysis and website generation
- **Caching**: Redis via Upstash
- **Authentication**: (To be implemented)
- **Payments**: (To be implemented)

## Setup

### API Keys Setup

#### Google Places API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Places API:
   - Go to "APIs & Services" > "Library"
   - Search for "Places API" and enable it
4. Create API credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key
5. Add the API key to your environment variables:
   \`\`\`
   GOOGLE_PLACES_API_KEY=your_places_api_key_here
   \`\`\`

#### PageSpeed Insights API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Use the same project as for the Places API or create a new one
3. Enable the PageSpeed Insights API:
   - Go to "APIs & Services" > "Library"
   - Search for "PageSpeed Insights API" and enable it
4. Create API credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key
5. Add the API key to your environment variables:
   \`\`\`
   PAGESPEED_API_KEY=your_pagespeed_api_key_here
   \`\`\`

### Redis Setup (Optional, for caching)

1. Create an account on [Upstash](https://upstash.com/)
2. Create a new Redis database
3. Copy the REST URL and REST Token
4. Add them to your environment variables:
   \`\`\`
   UPSTASH_REDIS_REST_URL=your_rest_url_here
   UPSTASH_REDIS_REST_TOKEN=your_rest_token_here
   \`\`\`

## Development

1. Clone the repository
2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`
3. Set up environment variables (see above)
4. Run the development server:
   \`\`\`
   npm run dev
   \`\`\`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

This application can be deployed to Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

## Business Model

### Subscription Plans

1. **Starter Plan ($49/month)**
   - 50 business searches per month
   - Basic website analysis
   - 5 AI redesigns per month
   - Email support

2. **Professional Plan ($99/month)**
   - 200 business searches per month
   - Advanced website analysis
   - 25 AI redesigns per month
   - Priority email support
   - Export and reporting features

3. **Agency Plan ($199/month)**
   - Unlimited business searches
   - Comprehensive website analysis
   - 100 AI redesigns per month
   - Priority phone & email support
   - White-label reports
   - Team collaboration features

### Target Audience

- Freelance web designers
- Web design agencies
- Digital marketing agencies
- SEO consultants
- Business consultants

## Roadmap

- [ ] Implement authentication system
- [ ] Set up payment processing with Stripe
- [ ] Add team collaboration features
- [ ] Create email notification system
- [ ] Develop white-label reporting
- [ ] Add CRM integration
- [ ] Implement map view for search results
- [ ] Create mobile app version

## License

Proprietary - All Rights Reserved
