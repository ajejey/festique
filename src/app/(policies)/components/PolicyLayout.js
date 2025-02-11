'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const policies = [
  { name: 'Terms & Conditions', path: '/terms' },
  { name: 'Privacy Policy', path: '/privacy' },
  { name: 'Refund & Cancellation', path: '/refund' },
  { name: 'Contact Us', path: '/contact' },
];

export default function PolicyLayout({ children, title }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl md:text-4xl font-playfair font-bold text-neutral-900">{title}</h1>
      
      <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-4">
        {policies.map((policy) => (
          <Link
            key={policy.path}
            href={policy.path}
            className={`px-4 py-2 rounded-full text-sm ${
              pathname === policy.path
                ? 'bg-primary text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {policy.name}
          </Link>
        ))}
      </div>

      <div className="prose max-w-none">
        {children}
      </div>

      <div className="text-sm text-neutral-500 border-t border-neutral-200 pt-4 mt-8">
        Last updated: February 11, 2025
      </div>
    </div>
  );
}
