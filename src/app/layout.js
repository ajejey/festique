import { Montserrat, Playfair_Display } from 'next/font/google'
import Header from './components/Header'
import "./globals.css";

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat'
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair'
})

export const metadata = {
  title: 'Festique - Your Ultimate Event Ticketing Platform',
  description: 'Discover and register for running events. One platform, endless possibilities.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${playfair.variable}`}>
      <body className="bg-neutral-50 font-montserrat">
        <Header />
        {children}
      </body>
    </html>
  )
}
