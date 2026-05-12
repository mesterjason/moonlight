import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MoonLight — AI Viral Clip Generator',
  description:
    'Turn long videos, podcasts, and streams into viral TikTok, Shorts, and Reels with one click. Powered by AI.',
  openGraph: {
    title: 'MoonLight — AI Viral Clip Generator',
    description: 'Turn long content into viral moments. Instantly.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
