import React, { type JSX, type ReactNode } from 'react';

type HeadingLevel = 1 | 2 | 3;

interface TypographyProps {
  children: ReactNode;
  className?: string;
}

interface HeadingProps extends TypographyProps {
  level?: HeadingLevel;
}

export const Heading: React.FC<HeadingProps> = ({ level = 1, children, className = "" }) => {
  const styles: Record<HeadingLevel, string> = {
    1: "text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900",
    2: "text-3xl font-bold text-slate-800",
    3: "text-xl font-semibold text-slate-700",
  };
  
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag className={`${styles[level]} ${className}`}>{children}</Tag>;
};

export const Text: React.FC<TypographyProps> = ({ children, className = "" }) => (
  <p className={`text-slate-600 leading-relaxed text-lg ${className}`}>
    {children}
  </p>
);