import Providers from './providers/Providers';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Uwise - Your Ultimate Learning Platform',
  description: 'Learn anytime, anywhere with Uwise',
  icons: {
    icon: '/icon.svg',
  },
  alternates: {
    explore: {
      title: 'Explore Courses | Uwise',
      description: 'Discover a wide range of courses in various categories',
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
