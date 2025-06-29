"use client"

import React, { useState, useCallback, useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  User, 
  GraduationCap, 
  FileText, 
  Phone,
} from 'lucide-react';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DocumentUpload } from "@/components/ui/document-upload"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { ApplicationFormData, UploadedFile } from "@/types/application"

// Zod Schema for form validation
const applicationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
  homeAddress: z.string().min(10, "Home address must be at least 10 characters"),
  university: z.string().min(1, "University selection is required"),
  course: z.string().min(2, "Course name must be at least 2 characters"),
  courseLevel: z.string().min(1, "Course level is required"),
  preferredIntake: z.string().min(1, "Preferred intake is required"),
  previousEducation: z.string().min(10, "Previous education details must be at least 10 characters"),
  englishProficiency: z.string().min(1, "English proficiency test is required"),
  englishScore: z.string().optional(),
  emergencyContact: z.string().min(2, "Emergency contact name is required"),
  emergencyPhone: z.string().min(10, "Emergency contact phone is required"),
  financialSupport: z.string().optional(),
  notes: z.string().optional(),
});

// Form data type derived from Zod schema
type FormData = z.infer<typeof applicationSchema> & {
  documents: {
    passport: UploadedFile[];
    transcripts: UploadedFile[];
    englishTest: UploadedFile[];
    personalStatement: UploadedFile[];
    references: UploadedFile[];
  };
};

interface ApplicationFormProps {
  onClose: () => void;
  onSubmit: (data: ApplicationFormData) => void;
}

export function ApplicationForm({ onClose, onSubmit }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [documents, setDocuments] = useState<FormData['documents']>({
    passport: [],
    transcripts: [],
    englishTest: [],
    personalStatement: [],
    references: []
  });

  const form = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationality: '',
    homeAddress: '',
    university: '',
    course: '',
    courseLevel: '',
    preferredIntake: '',
    previousEducation: '',
    englishProficiency: '',
    englishScore: '',
    emergencyContact: '',
    emergencyPhone: '',
    financialSupport: '',
    notes: '',
    }
  });

  // Watch form values for real-time progress calculation
  const formValues = form.watch();

  // Calculate progress whenever form values or documents change
  useEffect(() => {
    const calculateProgress = () => {
      // Define required form fields (excluding optional ones)
      const requiredFormFields = [
        'firstName',
        'lastName', 
        'email',
        'phone',
        'dateOfBirth',
        'nationality',
        'homeAddress',
        'university',
        'course',
        'courseLevel',
        'preferredIntake',
        'previousEducation',
        'englishProficiency',
        'emergencyContact',
        'emergencyPhone'
      ];
    
      // Count filled required form fields
      const filledFormFields = requiredFormFields.filter(field => {
        const value = formValues[field as keyof typeof formValues];
        return value && typeof value === 'string' && value.trim() !== '';
      }).length;
    
      // Define required document types
      const requiredDocumentTypes = ['passport', 'transcripts', 'englishTest', 'personalStatement', 'references'];
      
      // Count uploaded document types (at least one file uploaded for each type)
      const uploadedDocumentTypes = requiredDocumentTypes.filter(docType => {
        const docFiles = documents[docType as keyof FormData['documents']];
        return docFiles && docFiles.length > 0 && docFiles.some(file => file.status === 'uploaded');
      }).length;
    
      // Calculate total progress
      const totalRequiredItems = requiredFormFields.length + requiredDocumentTypes.length;
      const totalCompletedItems = filledFormFields + uploadedDocumentTypes;
      
      const progressPercentage = totalRequiredItems > 0 
        ? Math.round((totalCompletedItems / totalRequiredItems) * 100) 
        : 0;
    
      setProgress(progressPercentage);
    };

    calculateProgress();
  }, [formValues, documents]);

  // Generate preview URL for image files
  const generatePreview = (file: File): string | undefined => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return undefined;
  };

  // Handle file upload for new multi-file component
  const handleFileUpload = useCallback(async (type: keyof FormData['documents'], files: File[]) => {
    try {
      const newFiles: UploadedFile[] = files.map(file => ({
        id: `${type}-${Date.now()}-${Math.random()}`,
        file,
        status: 'pending',
        preview: generatePreview(file)
      }));

      // Update status to uploading
      setDocuments(prev => ({
        ...prev,
        [type]: [...prev[type], ...newFiles]
      }));

      // Upload files to backend
      const uploadPromises = newFiles.map(async (fileData) => {
        try {
          const formData = new FormData();
          formData.append('file', fileData.file);
          formData.append('type', type);

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Upload failed');
          }

          const result = await response.json();
          
          // Update file with uploaded data
          return {
            ...fileData,
            status: 'uploaded' as const,
            fileUrl: result.fileUrl,
            s3Key: result.s3Key,
          };
        } catch (error) {
          console.error('File upload error:', error);
          return {
            ...fileData,
            status: 'error' as const,
            error: 'Failed to upload file'
          };
        }
      });

      const uploadedFiles = await Promise.all(uploadPromises);

      // Update documents state with upload results
      setDocuments(prev => ({
        ...prev,
        [type]: prev[type].map(file => {
          const uploadedFile = uploadedFiles.find(uf => uf.id === file.id);
          return uploadedFile || file;
        })
      }));

    } catch (error) {
      console.error('File upload error:', error);
      // Update status to error for all files
      setDocuments(prev => ({
        ...prev,
        [type]: prev[type].map(file => 
          files.some(() => {
            const newFileId = `${type}-${Date.now()}-${Math.random()}`;
            return newFileId === file.id;
          }) 
            ? { ...file, status: 'error' as const, error: 'Failed to upload file' }
            : file
        )
      }));
    }
  }, []);

  // Handle file removal for new multi-file component
  const handleFileRemove = useCallback((type: keyof FormData['documents'], fileId: string) => {
    setDocuments(prev => ({
      ...prev,
      [type]: prev[type].filter(file => file.id !== fileId)
    }));
  }, []);

  // Handle file view
  const handleFileView = useCallback((file: UploadedFile) => {
    if (file.preview) {
      window.open(file.preview, '_blank');
    } else {
      const url = URL.createObjectURL(file.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (values: z.infer<typeof applicationSchema>) => {
    setIsSubmitting(true);

    try {
      // Validate that required documents are uploaded
      const requiredDocuments = ['passport', 'transcripts', 'englishTest', 'personalStatement', 'references'];
      const missingDocuments = requiredDocuments.filter(docType => 
        documents[docType as keyof FormData['documents']].length === 0
      );

      if (missingDocuments.length > 0) {
        const missingDocNames = {
          passport: 'Passport Copy',
          transcripts: 'Academic Transcripts',
          englishTest: 'English Test Scores',
          personalStatement: 'Personal Statement',
          references: 'References'
        };
        
        const missingNames = missingDocuments.map(doc => missingDocNames[doc as keyof typeof missingDocNames]).join(', ');
        alert(`Please upload the following required documents: ${missingNames}`);
        setIsSubmitting(false);
        return;
      }

      const formData: FormData = {
        ...values,
        documents
      };
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="sticky top-0 bg-white border-b border-gray-200 z-10">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Student Application Form</CardTitle>
              <CardDescription className="mt-1">
                Please fill out all required fields and upload necessary documents
              </CardDescription>
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600">{progress}%</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <span className="text-2xl text-gray-500">&times;</span>
            </Button>
          </div>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-8">
          {/* Personal Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                <Input
                          placeholder="Enter first name"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter last name"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                <Input
                  type="email"
                          placeholder="Enter email address"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                <Input
                  type="tel"
                          placeholder="Enter phone number"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth *</FormLabel>
                      <FormControl>
                <Input
                  type="date"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality *</FormLabel>
                      <FormControl>
                <select
                          disabled={isSubmitting}
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Nationality</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="India">India</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="Egypt">Egypt</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Other">Other</option>
                </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="homeAddress"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Home Address *</FormLabel>
                      <FormControl>
                <textarea
                  rows={3}
                          placeholder="Enter home address"
                          disabled={isSubmitting}
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-green-600" />
              Academic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="university"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred University *</FormLabel>
                      <FormControl>
                <select
                          disabled={isSubmitting}
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select University</option>
                  <option value="University of Cambridge">University of Cambridge</option>
                  <option value="University of Oxford">University of Oxford</option>
                  <option value="Imperial College London">Imperial College London</option>
                  <option value="University of Manchester">University of Manchester</option>
                  <option value="King's College London">King&apos;s College London</option>
                  <option value="University of Edinburgh">University of Edinburgh</option>
                </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="course"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course/Program *</FormLabel>
                      <FormControl>
                <Input
                  placeholder="e.g., MSc Computer Science"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="courseLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Level *</FormLabel>
                      <FormControl>
                <select
                          disabled={isSubmitting}
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Level</option>
                  <option value="Foundation">Foundation</option>
                  <option value="Undergraduate">Undergraduate</option>
                  <option value="Postgraduate">Postgraduate</option>
                  <option value="PhD">PhD</option>
                </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferredIntake"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Intake *</FormLabel>
                      <FormControl>
                <select
                          disabled={isSubmitting}
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Intake</option>
                  <option value="September 2025">September 2025</option>
                  <option value="January 2026">January 2026</option>
                  <option value="May 2026">May 2026</option>
                </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="englishProficiency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>English Proficiency Test *</FormLabel>
                      <FormControl>
                <select
                          disabled={isSubmitting}
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Test</option>
                  <option value="IELTS">IELTS</option>
                  <option value="TOEFL">TOEFL</option>
                  <option value="PTE">PTE</option>
                  <option value="Duolingo">Duolingo</option>
                  <option value="Not Taken">Not Taken Yet</option>
                </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="englishScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>English Test Score</FormLabel>
                      <FormControl>
                <Input
                  placeholder="e.g., 7.0, 95, etc."
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="previousEducation"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Previous Education *</FormLabel>
                      <FormControl>
                <textarea
                  rows={3}
                  placeholder="List your previous qualifications, institutions attended, and graduation years"
                          disabled={isSubmitting}
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
          </div>

          {/* Document Upload */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-purple-600" />
              Required Documents
            </h3>
              
              {/* Document Status Overview */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Document Status</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { key: 'passport', label: 'Passport Copy', files: documents.passport },
                    { key: 'transcripts', label: 'Academic Transcripts', files: documents.transcripts },
                    { key: 'englishTest', label: 'English Test Scores', files: documents.englishTest },
                    { key: 'personalStatement', label: 'Personal Statement', files: documents.personalStatement },
                    { key: 'references', label: 'References', files: documents.references }
                  ].map(({ key, label, files }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${
                        files.length > 0 ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm text-gray-600">{label}</span>
                      <span className="text-xs text-gray-500">({files.length} uploaded)</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-6">
              <DocumentUpload
                type="passport"
                  label="Passport Copy *"
                  files={documents.passport}
                  maxFiles={2}
                  maxFileSize={5}
                  acceptedTypes={['.pdf', '.jpg', '.jpeg', '.png']}
                  onUpload={(files) => handleFileUpload('passport', files)}
                  onRemove={(fileId) => handleFileRemove('passport', fileId)}
                  onView={handleFileView}
                  required={true}
              />
              <DocumentUpload
                type="transcripts"
                  label="Academic Transcripts *"
                  files={documents.transcripts}
                  maxFiles={5}
                  maxFileSize={10}
                  acceptedTypes={['.pdf', '.doc', '.docx']}
                  onUpload={(files) => handleFileUpload('transcripts', files)}
                  onRemove={(fileId) => handleFileRemove('transcripts', fileId)}
                  onView={handleFileView}
                  required={true}
              />
              <DocumentUpload
                type="englishTest"
                  label="English Test Scores *"
                  files={documents.englishTest}
                  maxFiles={3}
                  maxFileSize={5}
                  acceptedTypes={['.pdf', '.jpg', '.jpeg', '.png']}
                  onUpload={(files) => handleFileUpload('englishTest', files)}
                  onRemove={(fileId) => handleFileRemove('englishTest', fileId)}
                  onView={handleFileView}
                  required={true}
              />
              <DocumentUpload
                type="personalStatement"
                  label="Personal Statement *"
                  files={documents.personalStatement}
                  maxFiles={2}
                  maxFileSize={5}
                  acceptedTypes={['.pdf', '.doc', '.docx']}
                  onUpload={(files) => handleFileUpload('personalStatement', files)}
                  onRemove={(fileId) => handleFileRemove('personalStatement', fileId)}
                  onView={handleFileView}
                  required={true}
              />
              <DocumentUpload
                type="references"
                  label="References (Academic/Work) *"
                  files={documents.references}
                  maxFiles={3}
                  maxFileSize={5}
                  acceptedTypes={['.pdf', '.doc', '.docx']}
                  onUpload={(files) => handleFileUpload('references', files)}
                  onRemove={(fileId) => handleFileRemove('references', fileId)}
                  onView={handleFileView}
                  required={true}
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Phone className="h-5 w-5 mr-2 text-red-600" />
              Emergency Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="emergencyContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Name *</FormLabel>
                      <FormControl>
                <Input
                          placeholder="Enter emergency contact name"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergencyPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Phone *</FormLabel>
                      <FormControl>
                <Input
                  type="tel"
                          placeholder="Enter emergency contact phone"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="financialSupport"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Financial Support</FormLabel>
                      <FormControl>
                        <select
                          disabled={isSubmitting}
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Option</option>
                          <option value="Self-funded">Self-funded</option>
                          <option value="Family Support">Family Support</option>
                          <option value="Scholarship">Scholarship</option>
                          <option value="Student Loan">Student Loan</option>
                          <option value="Sponsorship">Sponsorship</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <textarea
                          rows={3}
                          placeholder="Any additional information or special requirements"
                          disabled={isSubmitting}
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
                variant={isSubmitting ? "secondary" : "default"}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
        </Form>
      </Card>
    </div>
  );
}