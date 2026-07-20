import Image from "next/image";
import Link from "next/link";
import lockmytime from "@/assets/LockMyTime.png";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-gray-100 bg-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-10">
          {/* Brand & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image className="w-10 h-10 rounded-full object-cover" src={lockmytime} alt="LockMyTime Logo" />
              <span className="font-bold text-xl text-blue-600 tracking-tight">LockMyTime</span>
            </Link>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm leading-relaxed">
              Your beauty, our priority. LockMyTime helps you find and book top-rated salons near you in seconds.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2 text-gray-400">
              <a href="#" className="p-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-full transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="p-2 bg-gray-50 hover:bg-pink-50 hover:text-pink-600 rounded-full transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="p-2 bg-gray-50 hover:bg-blue-50 hover:text-blue-400 rounded-full transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z"/></svg>
              </a>
            </div>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-900 tracking-wider uppercase">COMPANY</p>
            <ul className="space-y-2 text-xs text-gray-500">
              <li><Link href="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 transition-colors">Contact Us</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-900 tracking-wider uppercase">FOR BUSINESS</p>
            <ul className="space-y-2 text-xs text-gray-500">
              <li><Link href="/shop-owner" className="hover:text-blue-600 transition-colors">List Your Salon</Link></li>
              <li><Link href="/shop-owner" className="hover:text-blue-600 transition-colors">Business Login</Link></li>
            </ul>
          </div>

          {/* Download App */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-900 tracking-wider uppercase">DOWNLOAD APP</p>
            <div className="space-y-2">
              <button className="w-full bg-black text-white px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-800 transition-colors cursor-pointer text-left">
                <svg className="w-5 h-5 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M3 20.5v-17c0-.83.67-1.5 1.5-1.5h.5l10.5 10-10.5 10h-.5c-.83 0-1.5-.67-1.5-1.5zm1.5-16.5l8.5 8.5-8.5 8.5v-17zm11.5 8.5l3.5-3.5c.39-.39.39-1.02 0-1.41l-2.09-2.09-3.41 3.41 2 3.59zm-2 2l-3.41 3.41 2.09 2.09c.39.39 1.02.39 1.41 0l3.5-3.5-3.59-2z"/></svg>
                <div>
                  <p className="text-[9px] uppercase tracking-wider opacity-75">GET IT ON</p>
                  <p className="text-xs font-semibold leading-none">Google Play</p>
                </div>
              </button>
              <button className="w-full bg-black text-white px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-800 transition-colors cursor-pointer text-left">
                <svg className="w-5 h-5 text-white shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.66-.8 1.11-1.92.99-3.04-.96.04-2.13.64-2.81 1.44-.61.71-1.14 1.86-.99 2.96 1.07.08 2.16-.56 2.81-1.36z"/></svg>
                <div>
                  <p className="text-[9px] uppercase tracking-wider opacity-75">Download on the</p>
                  <p className="text-xs font-semibold leading-none">App Store</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 text-center">
          <p className="text-xs text-gray-400">
            © 2026 LockMyTime. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
