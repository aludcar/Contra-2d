import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Operation Iron Falcon',
  description: 'Retro run-and-gun homage built with Next.js and Canvas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
