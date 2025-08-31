import type { Metadata } from 'next';
import './globals.css';
import { AppLayout } from '@/components/app-layout';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { ProjectProvider } from '@/hooks/use-project';
import { HourLogProvider } from '@/components/providers/hour-log-provider';

export const metadata: Metadata = {
  title: 'Hourglass Horizons',
  description: 'Track your 10,000 hours to mastery.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <HourLogProvider>
            <ProjectProvider>
              <AppLayout>
                {children}
              </AppLayout>
            </ProjectProvider>
          </HourLogProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
