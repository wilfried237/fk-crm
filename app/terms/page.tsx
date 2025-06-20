"use client"

import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { Footer } from '@/components/ui/footer';

export default function TermsPage() {
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
          {/* Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms & Conditions</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Terms Content */}
          <div className="prose prose-gray max-w-none space-y-8">
            
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to FK CRM ("we," "our," or "us"). These Terms and Conditions govern your use of our 
                customer relationship management platform and services. By accessing or using our services, 
                you agree to be bound by these terms.
              </p>
            </section>

            {/* Definitions */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Definitions</h2>
              <div className="space-y-3">
                <p className="text-gray-700"><strong>"Service"</strong> refers to the FK CRM platform and all related features.</p>
                <p className="text-gray-700"><strong>"User"</strong> refers to any individual or entity using our Service.</p>
                <p className="text-gray-700"><strong>"Content"</strong> refers to all data, information, and materials uploaded to our Service.</p>
                <p className="text-gray-700"><strong>"Account"</strong> refers to your registered profile on our platform.</p>
              </div>
            </section>

            {/* Account Registration */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Account Registration</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  To use our Service, you must register for an account. You agree to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your login credentials secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use</li>
                </ul>
              </div>
            </section>

            {/* Acceptable Use */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use Policy</h2>
              <div className="space-y-4">
                <p className="text-gray-700">You agree not to use our Service to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Transmit harmful, offensive, or inappropriate content</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with the Service's operation or other users</li>
                  <li>Use automated systems to access the Service</li>
                  <li>Resell or redistribute our Service without permission</li>
                </ul>
              </div>
            </section>

            {/* Data and Privacy */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data and Privacy</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Your privacy is important to us. Our collection and use of personal information is governed by our 
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium"> Privacy Policy</Link>.
                </p>
                <p className="text-gray-700">
                  You are responsible for ensuring that any personal data you upload complies with applicable data protection laws.
                </p>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Our Service and its original content, features, and functionality are owned by FK CRM and are protected by 
                  international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
                <p className="text-gray-700">
                  You retain ownership of content you upload, but grant us a license to use it for providing the Service.
                </p>
              </div>
            </section>

            {/* Payment Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Payment Terms</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Subscription fees are billed in advance on a monthly or annual basis. You agree to pay all fees 
                  associated with your chosen plan.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Fees are non-refundable except as required by law</li>
                  <li>We may change our pricing with 30 days notice</li>
                  <li>Late payments may result in service suspension</li>
                  <li>All fees are exclusive of applicable taxes</li>
                </ul>
              </div>
            </section>

            {/* Service Availability */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Service Availability</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  We strive to maintain high service availability but cannot guarantee uninterrupted access. 
                  We may perform maintenance that temporarily affects service availability.
                </p>
                <p className="text-gray-700">
                  We are not liable for any damages resulting from service interruptions or technical issues.
                </p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  To the maximum extent permitted by law, FK CRM shall not be liable for any indirect, incidental, 
                  special, consequential, or punitive damages, including but not limited to loss of profits, data, 
                  or business opportunities.
                </p>
                <p className="text-gray-700">
                  Our total liability shall not exceed the amount paid by you for the Service in the 12 months 
                  preceding the claim.
                </p>
              </div>
            </section>

            {/* Termination */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Termination</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  You may cancel your account at any time through your account settings. We may terminate or 
                  suspend your account immediately if you violate these terms.
                </p>
                <p className="text-gray-700">
                  Upon termination, your right to use the Service ceases immediately. We may delete your data 
                  after 30 days unless required by law to retain it longer.
                </p>
              </div>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Governing Law</h2>
              <p className="text-gray-700">
                These terms are governed by and construed in accordance with the laws of [Your Jurisdiction]. 
                Any disputes shall be resolved in the courts of [Your Jurisdiction].
              </p>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these terms at any time. We will notify users of significant changes 
                via email or through the Service. Continued use after changes constitutes acceptance of the new terms.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Contact Information</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2">
                  If you have any questions about these Terms & Conditions, please contact us:
                </p>
                <div className="space-y-1 text-gray-700">
                  <p><strong>Email:</strong> legal@fkcrm.com</p>
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