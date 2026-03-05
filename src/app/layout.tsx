import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Note Saver - E-Commerce Notes',
  description: 'Save and manage your e-commerce notes, product info, supplier contacts, and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
