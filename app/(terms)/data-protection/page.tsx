"use client"

import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { Footer } from '@/components/ui/footer';

export default function DataProtectionPage() {
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
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <ShieldCheck className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Protection</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Commitment to Data Protection</h2>
              <p className="text-gray-700 leading-relaxed">
                We are committed to protecting your personal data and complying with all applicable data protection laws, including the General Data Protection Regulation (GDPR) and other relevant privacy regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Principles of Data Processing</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Lawfulness, fairness, and transparency</li>
                <li>Purpose limitation</li>
                <li>Data minimization</li>
                <li>Accuracy</li>
                <li>Storage limitation</li>
                <li>Integrity and confidentiality</li>
                <li>Accountability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Your Data Protection Rights</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Right to access your personal data</li>
                <li>Right to rectification of inaccurate data</li>
                <li>Right to erasure (&quot;right to be forgotten&quot;)</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
                <li>Right to withdraw consent at any time</li>
                <li>Right to lodge a complaint with a supervisory authority</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security Measures</h2>
              <p className="text-gray-700">
                We implement appropriate technical and organizational measures to ensure the security and confidentiality of your personal data, including encryption, access controls, and regular security assessments.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Transfers</h2>
              <p className="text-gray-700">
                Your data may be transferred to and processed in countries outside your own. We ensure that appropriate safeguards are in place to protect your data in accordance with applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
              <p className="text-gray-700">
                We retain your personal data only as long as necessary for the purposes for which it was collected, or as required by law. When no longer needed, your data will be securely deleted or anonymized.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Contact Information</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2">
                  If you have any questions about our data protection practices or wish to exercise your rights, please contact us:
                </p>
                <div className="space-y-1 text-gray-700">
                  <p><strong>Email:</strong> dpo@fkcrm.com</p>
                  <p><strong>Data Protection Officer:</strong> dpo@fkcrm.com</p>
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