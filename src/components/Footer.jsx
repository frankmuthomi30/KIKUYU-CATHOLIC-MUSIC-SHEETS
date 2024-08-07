import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Music, Mail, Phone } from 'lucide-react';

const FooterLink = ({ to, children }) => (
  <Link to={to} className="text-blue-300 hover:text-white transition-colors duration-300">
    {children}
  </Link>
);

const SocialLink = ({ href, icon: Icon }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-white transition-colors duration-300">
    <Icon size={24} />
  </a>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-black to-slate-800 text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Kikuyu Music Sheets</h2>
            <p className="text-sm text-blue-100">Preserving and sharing the Kikuyu Catholic Musical Notes.</p>
            <div className="flex space-x-4">
              <SocialLink href="https://facebook.com" icon={Facebook} />
              <SocialLink href="https://twitter.com" icon={Twitter} />
              <SocialLink href="https://instagram.com" icon={Instagram} />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><FooterLink to="/">Home</FooterLink></li>
              <li><FooterLink to="/about">About Us</FooterLink></li>
              <li><FooterLink to="/upload">Upload Sheet</FooterLink></li>
              <li><FooterLink to="/search">Search Sheets</FooterLink></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Music className="mr-2" size={18} />
                <span>Our Lady Of Farmers-Wamagana Catholic Parish, Nyeri, Kenya</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2" size={18} />
                <a href="mailto:frankmuthomi30@gmail.com" className="hover:underline">frankmuthomi30@gmail.com</a>
              </li>
              <li className="flex items-center">
                <Phone className="mr-2" size={18} />
                <a href="tel:+254797887378" className="hover:underline">+254 797 887 378</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-blue-700 text-center">
          <p className='text-slate-300'>Powered by Firebase Technologies.</p>
          <p className="text-sm text-blue-200">&copy; {currentYear} Kikuyu Music Sheets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;