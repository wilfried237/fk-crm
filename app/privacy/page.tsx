"use client"

import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';
import { Footer } from '@/components/ui/footer';

export default function PrivacyPage() {
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
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Privacy Content */}
          <div className="prose prose-gray max-w-none space-y-8">
            
            {/* Introduction */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                FK CRM ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains 
                how we collect, use, disclose, and safeguard your information when you use our customer relationship 
                management platform and services.
              </p>
              <p className="text-gray-700 leading-relaxed mt-4">
                By using our Service, you consent to the data practices described in this policy. If you do not 
                agree with our policies and practices, please do not use our Service.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Personal Information</h3>
              <p className="text-gray-700 mb-3">We may collect the following personal information:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Name, email address, and contact information</li>
                <li>Company name and job title</li>
                <li>Payment and billing information</li>
                <li>Profile information and preferences</li>
                <li>Communication records and support tickets</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.2 Usage Information</h3>
              <p className="text-gray-700 mb-3">We automatically collect certain information about your use of our Service:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>IP address and device information</li>
                <li>Browser type and operating system</li>
                <li>Pages visited and time spent on our Service</li>
                <li>Features used and interactions with our platform</li>
                <li>Error logs and performance data</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">2.3 Customer Data</h3>
              <p className="text-gray-700">
                You may upload customer data to our platform. We process this data on your behalf and in accordance 
                with your instructions. You remain responsible for ensuring you have the right to share this data with us.
              </p>
            </section>

            {/* How We Use Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700 mb-3">We use the collected information for the following purposes:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Provide, maintain, and improve our Service</li>
                <li>Process transactions and manage your account</li>
                <li>Send you important updates and notifications</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Detect and prevent fraud, abuse, and security threats</li>
                <li>Comply with legal obligations and enforce our terms</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-3">We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:</p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Service Providers</h3>
              <p className="text-gray-700 mb-3">
                We may share information with trusted third-party service providers who assist us in operating our Service:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Cloud hosting and infrastructure providers</li>
                <li>Payment processors and billing services</li>
                <li>Customer support and communication tools</li>
                <li>Analytics and monitoring services</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.2 Legal Requirements</h3>
              <p className="text-gray-700">
                We may disclose your information if required by law, court order, or government request, 
                or to protect our rights, property, or safety.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">4.3 Business Transfers</h3>
              <p className="text-gray-700">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred 
                as part of the transaction, subject to the same privacy protections.
              </p>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-700 mb-3">
                We implement appropriate technical and organizational measures to protect your information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Employee training on data protection</li>
                <li>Incident response and breach notification procedures</li>
              </ul>
              <p className="text-gray-700 mt-4">
                However, no method of transmission over the internet is 100% secure. We cannot guarantee 
                absolute security of your information.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Data Retention</h2>
              <p className="text-gray-700 mb-3">
                We retain your information for as long as necessary to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Provide our Service to you</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce agreements</li>
                <li>Improve our Service and user experience</li>
              </ul>
              <p className="text-gray-700 mt-4">
                When you delete your account, we will delete or anonymize your personal information within 
                30 days, unless we are required to retain it for legal purposes.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Your Rights and Choices</h2>
              <p className="text-gray-700 mb-3">Depending on your location, you may have the following rights:</p>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">7.1 Access and Portability</h3>
              <p className="text-gray-700">
                You can access, update, or export your personal information through your account settings 
                or by contacting us.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">7.2 Correction and Deletion</h3>
              <p className="text-gray-700">
                You can correct inaccurate information or request deletion of your personal data, 
                subject to legal requirements.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">7.3 Marketing Communications</h3>
              <p className="text-gray-700">
                You can opt out of marketing communications by following the unsubscribe instructions 
                in our emails or updating your preferences.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">7.4 Cookies and Tracking</h3>
              <p className="text-gray-700">
                You can control cookies through your browser settings. However, disabling cookies 
                may affect the functionality of our Service.
              </p>
            </section>

            {/* International Transfers */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. International Data Transfers</h2>
              <p className="text-gray-700">
                Your information may be transferred to and processed in countries other than your own. 
                We ensure appropriate safeguards are in place to protect your information in accordance 
                with applicable data protection laws.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Children's Privacy</h2>
              <p className="text-gray-700">
                Our Service is not intended for children under 16 years of age. We do not knowingly 
                collect personal information from children under 16. If you believe we have collected 
                such information, please contact us immediately.
              </p>
            </section>

            {/* Third-Party Services */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Third-Party Services</h2>
              <p className="text-gray-700">
                Our Service may contain links to third-party websites or integrate with third-party services. 
                We are not responsible for the privacy practices of these third parties. We encourage you 
                to review their privacy policies.
              </p>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any material 
                changes by email or through our Service. Your continued use of our Service after such 
                changes constitutes acceptance of the updated policy.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Contact Us</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-2 text-gray-700">
                  <p><strong>Email:</strong> privacy@fkcrm.com</p>
                  <p><strong>Data Protection Officer:</strong> dpo@fkcrm.com</p>
                  <p><strong>Address:</strong> [Your Company Address]</p>
                  <p><strong>Phone:</strong> [Your Phone Number]</p>
                </div>
                <p className="text-gray-700 mt-4">
                  For EU residents, you also have the right to lodge a complaint with your local 
                  data protection authority.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 