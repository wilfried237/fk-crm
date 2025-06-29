import { z } from 'zod';
import { Application } from './application';

// Admin action types
export type AdminAction = 'APPROVE' | 'REJECT' | 'WAITLIST';

// Admin action request
export interface AdminActionRequest {
  applicationId: string;
  action: AdminAction;
  reason?: string;
}

// Admin action response
export interface AdminActionResponse {
  success: boolean;
  application?: Application;
  message?: string;
  error?: string;
  details?: unknown;
}

// Admin applications response
export interface AdminApplicationsResponse {
  applications: Application[];
  total: number;
  error?: string;
}


// Admin action validation schema
export const adminActionSchema = {
  applicationId: 'string',
  action: z.enum(['APPROVE', 'REJECT', 'WAITLIST']) as z.ZodEnum<['APPROVE', 'REJECT', 'WAITLIST']>,
  reason: 'string?'
} as const;

// Application status mapping
export const applicationStatusMap = {
  APPROVE: 'accepted',
  REJECT: 'declined', 
  WAITLIST: 'waitlisted'
} as const;

// Email status configuration
export interface StatusEmailConfig {
  subject: string;
  color: string;
  icon: string;
  title: string;
  message: string;
}

export interface StatusEmailConfigs {
  APPROVED: StatusEmailConfig;
  REJECTED: StatusEmailConfig;
  WAITLISTED: StatusEmailConfig;
} 