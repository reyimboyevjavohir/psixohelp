import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export const metadata: Metadata = {
  title: 'PsixoHelp — Online Psixologik Yordam',
  description: "O'zbek tilida AI yordamida psixologik qo'llab-quvvatlash platformasi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body style={{ background: 'var(--c-bg)', color: 'var(--c-text)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <SiteHeader />
        <main style={{ flex: 1 }}>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
