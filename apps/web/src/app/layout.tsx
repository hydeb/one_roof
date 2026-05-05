import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'One Roof Homes — Big enough to handle it. Small enough to care.',
    template: '%s · One Roof Homes',
  },
  description:
    'Vetted home services, transparent quotes, and a real maintenance record for your home. Every contractor is accountable to us, not just to themselves.',
  applicationName: 'One Roof Homes',
  authors: [{ name: 'EngSec LLC' }],
  metadataBase: new URL('https://oneroofhomes.com'),
};

export const viewport: Viewport = {
  themeColor: '#7d5e2f',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
