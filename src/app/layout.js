import { Montserrat, Playfair_Display, Racing_Sans_One } from 'next/font/google'
import Header from './components/Header'
import Footer from '@/components/Footer'
import { Toaster } from 'sonner'
import "./globals.css";

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat'
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair'
})

const racing = Racing_Sans_One({ 
  subsets: ['latin'],
  variable: '--font-racing',
  weight: '400'
})

export const metadata = {
  title: 'Festique - Your Ultimate Event Ticketing Platform',
  description: 'Discover and register for running events. One platform, endless possibilities.',
}

export const viewport = {
  themeColor: '#FF6B6B', // Use your primary brand color
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${playfair.variable} ${racing.variable}`}>
      <body className="bg-neutral-50 font-montserrat">
        <Header />
        {children}
        <Footer />
        <Toaster 
          position="top-right"
          richColors
          closeButton
          duration={4000}
        />
      </body>
    </html>
  )
}
