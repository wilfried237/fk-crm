// Document upload state interface
export interface UploadedFile {
  id: string;
  file: File;
  status: 'pending' | 'uploading' | 'uploaded' | 'error';
  error?: string;
  preview?: string;
  uploadProgress?: number;
  fileUrl?: string;
  s3Key?: string;
}

// Transformed document data for API submission
export interface TransformedDocument {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
}

// Application form data structure
export interface ApplicationFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  homeAddress: string;
  
  // Academic Information
  university: string;
  course: string;
  courseLevel: string;
  preferredIntake: string;
  previousEducation: string;
  
  // English Proficiency
  englishProficiency: string;
  englishScore?: string;
  
  // Emergency Contact
  emergencyContact: string;
  emergencyPhone: string;
  
  // Additional Information
  financialSupport?: string;
  notes?: string;
  
  // Documents
  documents: {
    passport: UploadedFile[];
    transcripts: UploadedFile[];
    englishTest: UploadedFile[];
    personalStatement: UploadedFile[];
    references: UploadedFile[];
  };
}

// Transformed application data for API submission
export interface TransformedApplicationData extends Omit<ApplicationFormData, 'documents'> {
  documents: {
    passport: TransformedDocument[];
    transcripts: TransformedDocument[];
    englishTest: TransformedDocument[];
    personalStatement: TransformedDocument[];
    references: TransformedDocument[];
  };
}

// API Response types
export interface ApplicationSubmissionResponse {
  success: boolean;
  applicationId?: string;
  error?: string;
  message?: string;
}

// Application status types
export type ApplicationStatus = 'pending' | 'under_review' | 'accepted' | 'declined' | 'waitlisted';

// Application from database (includes additional fields)
export interface Application extends ApplicationFormData {
  id: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  adminNotes?: string;
  decisionReason?: string;
  decisionDate?: Date;
} 