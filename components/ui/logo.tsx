import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-xl',
    lg: 'w-16 h-16 text-2xl'
  };

  return (
    <div className={`inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl ${sizeClasses[size]} ${className}`}>
      <span className="font-bold text-white">FK</span>
    </div>
  );
} 