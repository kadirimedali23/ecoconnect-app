import React, { type ReactNode } from 'react';

export type ButtonVariant = 'success' | 'info' | 'danger' | 'alert';

interface ButtonProps {
  variant?: ButtonVariant;
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = "info", 
  children, 
  onClick, 
  className = "" 
}) => {
  const variants: Record<ButtonVariant, string> = {
    success: "bg-emerald-500 hover:bg-emerald-600 [box-shadow:0_6px_0_#064e3b] hover:[box-shadow:0_8px_0_#064e3b] active:[box-shadow:0_2px_0_#064e3b] active:translate-y-1 ring-emerald-500/20",
    info: "bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 ring-indigo-500/20",
    danger: "bg-rose-500 hover:bg-rose-600 shadow-xl shadow-rose-100 ring-rose-500/20",
    alert: "bg-amber-500 hover:bg-amber-600 shadow-xl shadow-amber-100 ring-amber-500/20",
  };

  return (
    <button
      onClick={onClick}
      className={`
        px-6 py-3 rounded-2xl font-bold text-white transition-all duration-100
        hover:-translate-y-1 focus:ring-4
        ${variants[variant]} ${className}
      `}
    >
      {children}
    </button>
  );
};