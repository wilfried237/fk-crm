"use client"

import React from 'react';
import { ArrowLeft, Cookie } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { Footer } from '@/components/ui/footer';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
            <div className="flex-1 text-center">
              <Logo size="sm" />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mb-4">
              <Cookie className="h-6 w-6 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cookies Policy</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. What Are Cookies?</h2>
              <p className="text-gray-700 leading-relaxed">
                Cookies are small text files stored on your device by your web browser. They help websites remember information about your visit, such as your preferences and login status, to improve your experience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Cookies</h2>
              <p className="text-gray-700">
                We use cookies to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Remember your login and session preferences</li>
                <li>Enable essential site functionality</li>
                <li>Analyze site usage and improve performance</li>
                <li>Personalize your experience</li>
                <li>Support security and detect fraud</li>
                <li>Deliver relevant content and advertisements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Types of Cookies We Use</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Essential Cookies:</strong> Required for basic site functionality and security.</li>
                <li><strong>Performance Cookies:</strong> Collect information about how you use our site to help us improve it.</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings.</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site.</li>
                <li><strong>Advertising Cookies:</strong> Used to deliver relevant ads and track ad performance.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Managing Your Cookie Preferences</h2>
              <p className="text-gray-700">
                You can manage or disable cookies through your browser settings. Please note that disabling cookies may affect the functionality of our site.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Most browsers allow you to block or delete cookies</li>
                <li>You can set preferences for certain types of cookies</li>
                <li>Some cookies are essential and cannot be disabled</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Third-Party Cookies</h2>
              <p className="text-gray-700">
                We may use third-party services (such as analytics and advertising partners) that set their own cookies. We do not control these cookies and recommend reviewing their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Changes to This Cookies Policy</h2>
              <p className="text-gray-700">
                We may update this Cookies Policy from time to time. We will notify you of any significant changes by posting the new policy on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Us</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2">
                  If you have any questions about our Cookies Policy, please contact us:
                </p>
                <div className="space-y-1 text-gray-700">
                  <p><strong>Email:</strong> privacy@fkcrm.com</p>
                  <p><strong>Address:</strong> [Your Company Address]</p>
                  <p><strong>Phone:</strong> [Your Phone Number]</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 