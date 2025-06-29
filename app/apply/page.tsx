"use client"

import React, { useState } from 'react';
import { ApplicationForm } from '@/components/application-form';
import { toast } from 'sonner';

export default function ApplyPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      // Transform the data to match the API expectations
      const transformedData = {
        ...data,
        documents: {
          passport: data.documents.passport.map((file: any) => ({
            id: file.id,
            fileName: file.file.name,
            fileUrl: file.fileUrl || URL.createObjectURL(file.file),
            fileSize: file.file.size,
            mimeType: file.file.type,
          })),
          transcripts: data.documents.transcripts.map((file: any) => ({
            id: file.id,
            fileName: file.file.name,
            fileUrl: file.fileUrl || URL.createObjectURL(file.file),
            fileSize: file.file.size,
            mimeType: file.file.type,
          })),
          englishTest: data.documents.englishTest.map((file: any) => ({
            id: file.id,
            fileName: file.file.name,
            fileUrl: file.fileUrl || URL.createObjectURL(file.file),
            fileSize: file.file.size,
            mimeType: file.file.type,
          })),
          personalStatement: data.documents.personalStatement.map((file: any) => ({
            id: file.id,
            fileName: file.file.name,
            fileUrl: file.fileUrl || URL.createObjectURL(file.file),
            fileSize: file.file.size,
            mimeType: file.file.type,
          })),
          references: data.documents.references.map((file: any) => ({
            id: file.id,
            fileName: file.file.name,
            fileUrl: file.fileUrl || URL.createObjectURL(file.file),
            fileSize: file.file.size,
            mimeType: file.file.type,
          })),
        },
      };

      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Application submitted successfully! Check your email for confirmation.');
        setIsFormOpen(false);
      } else {
        toast.error(result.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('An error occurred while submitting your application');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Student Application Portal
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Start your journey to study abroad with FK Education
          </p>
          
          {!isFormOpen && (
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Start Your Application
            </button>
          )}
        </div>

        {isFormOpen && (
          <ApplicationForm
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleSubmit}
          />
        )}

        {/* Information Section */}
        {!isFormOpen && (
          <div className="bg-white rounded-lg shadow-lg p-8 mt-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Application Process
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Fill Application
                </h3>
                <p className="text-gray-600">
                  Complete the online application form with your personal and academic details
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload Documents
                </h3>
                <p className="text-gray-600">
                  Upload all required documents including transcripts, passport, and test scores
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Review & Decision
                </h3>
                <p className="text-gray-600">
                  Our team will review your application and provide a decision within 2-3 weeks
                </p>
              </div>
            </div>

            <div className="mt-12 bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Required Documents
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    Passport Copy
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    Academic Transcripts
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    English Test Scores
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    Personal Statement
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    References
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                    Additional Supporting Documents
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 