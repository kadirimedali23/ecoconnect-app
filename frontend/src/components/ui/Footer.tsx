import React from 'react';
import { Container } from './Layout';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-20">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="text-white text-2xl font-black mb-6">🌱 EcoConnect</div>
            <p className="text-sm leading-relaxed">
              Connecting communities with eco-friendly businesses across Coventry and Warwickshire.
            </p>
          </div>

          {[
            { section: 'Explore', links: ['Business Directory', 'Zero Waste', 'Repair Cafés'] },
            { section: 'Community', links: ['Leave a Review', 'Sign In', 'Register'] },
            { section: 'About', links: ['Our Mission', 'Contact Us', 'Privacy Policy'] },
          ].map(({ section, links }) => (
            <div key={section}>
              <h4 className="text-white font-bold mb-6">{section}</h4>
              <ul className="space-y-4 text-sm">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="hover:text-emerald-400 transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs uppercase tracking-widest font-semibold">
          <p>© {new Date().getFullYear()} EcoConnect. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
