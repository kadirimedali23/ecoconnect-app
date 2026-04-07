import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from './Layout';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
      <Container>
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="text-2xl font-black text-emerald-700 tracking-tighter no-underline" style={{ textDecoration: 'none' }}>
            🌱 Eco<span className="text-slate-900">Connect</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-10">
            {[
              { label: 'Home', to: '/' },
              { label: 'Directory', to: '/directory' },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors uppercase tracking-widest"
                style={{ textDecoration: 'none' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Group */}
          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className="hidden sm:block text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors"
              style={{ textDecoration: 'none' }}
            >
              Sign In
            </Link>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Button variant="success" className="!rounded-full !py-2 !px-6 text-sm">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </nav>
  );
};

export default Navbar;
