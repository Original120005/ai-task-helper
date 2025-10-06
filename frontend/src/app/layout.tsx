import type { Metadata } from 'next';
// Удали Geist/Inter, если ругается (или установи: npm i geist)
import './globals.css';
import '@/styles/globals.scss';
import Providers from '@/components/Providers';  // @/ = src/, так что src/components/Providers.tsx.

export const metadata: Metadata = {
  title: 'AI Task Helper',
  description: 'AI-powered TODO/Habit Tracker',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Providers — клиентский, hooks внутри ок */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}