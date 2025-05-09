This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Facebook Pixel Integration

This project includes Facebook Pixel integration with the Pixel ID: `1706068603634026`.

### Implementation Details

The Facebook Pixel is implemented using:

1. Root Layout (`src/app/layout.tsx`): Injects the Facebook Pixel base code into the HTML head using Next.js Script component.
2. Client Component (`src/app/FacebookPixel.tsx`): Tracks route changes and sends page views to Facebook.
3. Utility functions (`src/lib/fpixel.ts`): Contains helper functions for tracking custom events.

### Usage

To track custom events, import the fpixel utility and use the event function in a client component:

```javascript
'use client';

import * as fbq from '@/lib/fpixel'

// Track a custom event
fbq.event('ButtonClick', { button: 'example' })
```

For more information, see the [Facebook Pixel documentation](https://developers.facebook.com/docs/facebook-pixel/implementation).
