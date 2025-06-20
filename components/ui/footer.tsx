import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface FooterProps {
  className?: string;
}

export function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`bg-white border-t border-gray-200 mt-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <h1 className="text-xl font-bold text-gray-900">FK CRM</h1>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Empowering educational institutions with comprehensive student relationship management solutions. 
              Streamline your admissions process and enhance student engagement.
            </p>
            <div className="flex space-x-4">
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">FK</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-gray-900">
                  Dashboard
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-gray-900">
                  Students
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-gray-900">
                  Applications
                </Button>
              </li>
              <li>
                <Button variant="link" className="p-0 h-auto text-gray-600 hover:text-gray-900">
                  Settings
                </Button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-gray-900 text-sm">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-gray-900 text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-600 hover:text-gray-900 text-sm">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/data-protection" className="text-gray-600 hover:text-gray-900 text-sm">
                  Data Protection
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            © 2024 FK CRM. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/terms" className="text-gray-600 hover:text-gray-900 text-sm">
              Terms
            </Link>
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900 text-sm">
              Privacy
            </Link>
            <Link href="/support" className="text-gray-600 hover:text-gray-900 text-sm">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 