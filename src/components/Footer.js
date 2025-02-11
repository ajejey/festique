import Link from 'next/link';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'Careers', href: '/careers' },
      { name: 'Blog', href: '/blog' },
    ],
    legal: [
      { name: 'Terms & Conditions', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Refund Policy', href: '/refund' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'FAQs', href: '/faqs' },
      { name: 'Report an Issue', href: '/support' },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com/festique.live', label: 'Instagram' },
    { icon: Facebook, href: 'https://facebook.com/festique.live', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com/festique_live', label: 'Twitter' },
  ];

  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-playfair font-bold">Festique</h2>
            <p className="text-neutral-400 text-sm">
              Your premier destination for discovering and booking amazing events.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-lg font-semibold capitalize">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-neutral-400 hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="border-t border-neutral-800 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 text-neutral-400">
              <Mail size={20} />
              <a href="mailto:festique.live@gmail.com" className="text-sm hover:text-primary">
                festique.live@gmail.com
              </a>
            </div>
            <div className="flex items-center space-x-3 text-neutral-400">
              <MapPin size={20} />
              <span className="text-sm">
                Uttrahalli, Bangalore, Karnataka - 560001
              </span>
            </div>
            <div className="flex items-center space-x-3 text-neutral-400">
              <Phone size={20} />
              <span className="text-sm">Mon-Fri, 9:00 AM - 6:00 PM IST</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-neutral-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-neutral-400 text-sm">
              © {currentYear} Festique. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-neutral-400">
              <span>Made with ❤️ in India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
