"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  User, 
  Mail, 
  Phone,
  Calendar,
  GraduationCap,
  Download,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import AdminRoute from '@/components/auth/AdminRoute';

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  homeAddress: string;
  university: string;
  course: string;
  courseLevel: string;
  preferredIntake: string;
  previousEducation: string;
  englishProficiency: string;
  englishScore?: string;
  emergencyContact: string;
  emergencyPhone: string;
  financialSupport?: string;
  notes?: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'WAITLISTED';
  submittedAt: string;
  updatedAt: string;
  documents: ApplicationDocument[];
}

interface ApplicationDocument {
  id: string;
  type: 'PASSPORT' | 'TRANSCRIPTS' | 'ENGLISH_TEST' | 'PERSONAL_STATEMENT' | 'REFERENCES';
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

interface ApplicationAction {
  applicationId: string;
  action: 'APPROVE' | 'REJECT' | 'WAITLIST';
  reason?: string;
}

function ApplicationsPageContent() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionData, setActionData] = useState<ApplicationAction | null>(null);
  const [reason, setReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Fetch all applications
  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/applications/admin');
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications);
      } else {
        toast.error('Failed to fetch applications');
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Error fetching applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Filter applications based on search and status
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.university.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle application action
  const handleApplicationAction = async () => {
    if (!actionData) return;

    try {
      const response = await fetch('/api/applications/admin/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...actionData,
          reason: reason.trim() || undefined,
        }),
      });

      if (response.ok) {
        toast.success('Application status updated successfully');
        setShowActionModal(false);
        setActionData(null);
        setReason('');
        fetchApplications(); // Refresh the list
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update application status');
      }
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error('Error updating application status');
    }
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      UNDER_REVIEW: { color: 'bg-blue-100 text-blue-800', icon: Eye },
      APPROVED: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      REJECTED: { color: 'bg-red-100 text-red-800', icon: XCircle },
      WAITLISTED: { color: 'bg-purple-100 text-purple-800', icon: Clock },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Management</h1>
        <p className="text-gray-600">Review and manage student applications</p>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name, email, or university..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="WAITLISTED">Waitlisted</option>
        </select>
      </div>

      {/* Applications List */}
      <div className="grid gap-6">
        {filteredApplications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No applications found</p>
            </CardContent>
          </Card>
        ) : (
          filteredApplications.map((application) => (
            <Card key={application.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      {application.firstName} {application.lastName}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {application.email}
                      </span>
                      <span className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {application.phone}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(application.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Academic Information</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><GraduationCap className="w-4 h-4 inline mr-2" />{application.university}</p>
                      <p><FileText className="w-4 h-4 inline mr-2" />{application.course} ({application.courseLevel})</p>
                      <p><Calendar className="w-4 h-4 inline mr-2" />Intake: {application.preferredIntake}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Documents</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      {application.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between">
                          <span>{doc.type.replace('_', ' ')}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(doc.fileUrl, '_blank')}
                          >
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Submitted: {formatDate(application.submittedAt)}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedApplication(application);
                        setShowModal(true);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    {application.status === 'PENDING' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => {
                            setActionData({
                              applicationId: application.id,
                              action: 'APPROVE'
                            });
                            setShowActionModal(true);
                          }}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => {
                            setActionData({
                              applicationId: application.id,
                              action: 'REJECT'
                            });
                            setShowActionModal(true);
                          }}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Application Details Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">
                  Application Details - {selectedApplication.firstName} {selectedApplication.lastName}
                </h2>
                <Button
                  variant="ghost"
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedApplication.firstName} {selectedApplication.lastName}</p>
                    <p><strong>Email:</strong> {selectedApplication.email}</p>
                    <p><strong>Phone:</strong> {selectedApplication.phone}</p>
                    <p><strong>Date of Birth:</strong> {formatDate(selectedApplication.dateOfBirth)}</p>
                    <p><strong>Nationality:</strong> {selectedApplication.nationality}</p>
                    <p><strong>Address:</strong> {selectedApplication.homeAddress}</p>
                  </div>
                </div>

                {/* Academic Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <GraduationCap className="w-5 h-5 mr-2" />
                    Academic Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>University:</strong> {selectedApplication.university}</p>
                    <p><strong>Course:</strong> {selectedApplication.course}</p>
                    <p><strong>Level:</strong> {selectedApplication.courseLevel}</p>
                    <p><strong>Intake:</strong> {selectedApplication.preferredIntake}</p>
                    <p><strong>English Test:</strong> {selectedApplication.englishProficiency}</p>
                    {selectedApplication.englishScore && (
                      <p><strong>Score:</strong> {selectedApplication.englishScore}</p>
                    )}
                  </div>
                </div>

                {/* Previous Education */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-3">Previous Education</h3>
                  <p className="text-sm bg-gray-50 p-3 rounded">{selectedApplication.previousEducation}</p>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Emergency Contact</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedApplication.emergencyContact}</p>
                    <p><strong>Phone:</strong> {selectedApplication.emergencyPhone}</p>
                  </div>
                </div>

                {/* Financial Support */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Financial Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Support:</strong> {selectedApplication.financialSupport || 'Not specified'}</p>
                    {selectedApplication.notes && (
                      <p><strong>Notes:</strong> {selectedApplication.notes}</p>
                    )}
                  </div>
                </div>

                {/* Documents */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-3">Documents</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedApplication.documents.map((doc) => (
                      <div key={doc.id} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{doc.type.replace('_', ' ')}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(doc.fileUrl, '_blank')}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600">{doc.fileName}</p>
                        <p className="text-xs text-gray-500">
                          {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Modal */}
      {showActionModal && actionData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">
              {actionData.action === 'APPROVE' ? 'Approve' : 'Reject'} Application
            </h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason (Optional)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Provide a reason for this decision..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowActionModal(false);
                  setActionData(null);
                  setReason('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleApplicationAction}
                className={`flex-1 ${
                  actionData.action === 'APPROVE' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionData.action === 'APPROVE' ? 'Approve' : 'Reject'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <AdminRoute>
      <ApplicationsPageContent />
    </AdminRoute>
  );
} 