import Link from 'next/link'
import React from 'react'

export async function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto bg-[#1a5276] text-white">
      {/* Main Footer Content */}
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="font-display text-2xl font-bold text-white">Crete Info</span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              Your complete guide to discovering the magic of Crete. From pristine beaches to
              ancient ruins, authentic cuisine to warm hospitality.
            </p>
          </div>

          {/* <div>
            <h4 className="font-semibold text-[#d4a84b] mb-4 text-sm uppercase tracking-wider">
              Services
            </h4>
            <nav className="flex flex-col gap-2">
              {[
                { label: 'Restaurants', href: '/restaurants' },
                { label: 'Taxi', href: '/taxi' },
                { label: 'Boats', href: '/boats' },
                { label: 'Excursions', href: '/excursions' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/70 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 className="font-semibold text-[#d4a84b] mb-4 text-sm uppercase tracking-wider">
              More
            </h4>
            <nav className="flex flex-col gap-2">
              {[
                { label: 'Rent a Car', href: '/rent-a-car' },
                { label: 'Accommodations', href: '/accommodations' },
                { label: 'Shops', href: '/shops' },
                { label: 'Cretan Groups', href: '/cretan-groups' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/70 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div> */}

          {/* Info Column */}
          <div>
            <h4 className="font-semibold text-[#d4a84b] mb-4 text-sm uppercase tracking-wider">
              Contact us
            </h4>
            <nav className="flex flex-col gap-2">
              {[
                { label: 'Phone - 00306972428721', href: '' },
                {
                  label: 'Facebook - Crete Info',
                  href: 'https://www.facebook.com/creteinfogreece',
                },
                {
                  label: 'Email - crete.info.promotions@gmail.com',
                  href: 'mailto:crete.info.promotions@gmail.com',
                },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/70 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-sm">
            &copy; {currentYear} Crete Info. All rights reserved.
          </p>
          <p className="text-white/50 text-sm">Made with love for Crete</p>
        </div>
      </div>
    </footer>
  )
}
