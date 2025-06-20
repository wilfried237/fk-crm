"use client"

import React, { useState } from 'react';
import { 
  FileText, 
  MessageSquare, 
  Calendar, 
  BarChart3, 
  Settings, 
  Bell, 
  Search, 
  Plus, 
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  Users,
  Share2,
  Copy,
  Check
} from 'lucide-react';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { ApplicationForm } from '@/components/application-form';
import { Footer } from '@/components/ui/footer';

interface Student {
  id: number;
  name: string;
  email: string;
  country: string;
  course: string;
  university: string;
  status: string;
  stage: number;
  leadScore: number;
  phone: string;
  englishLevel: string;
  intake: string;
}

interface DocumentUploadState {
  type: string;
  file: File | null;
  status: 'pending' | 'uploaded' | 'error';
  error?: string;
}

interface FormData {
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
  englishScore: string;
  hasPassport: boolean;
  hasTranscripts: boolean;
  hasEnglishTest: boolean;
  hasPersonalStatement: boolean;
  hasReferences: boolean;
  financialSupport: string;
  emergencyContact: string;
  emergencyPhone: string;
  notes: string;
  documents: {
    passport: DocumentUploadState;
    transcripts: DocumentUploadState;
    englishTest: DocumentUploadState;
    personalStatement: DocumentUploadState;
    references: DocumentUploadState;
  };
}

const CRMDemo = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'students' | 'application'>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState<FormData>({
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
    hasPassport: false,
    hasTranscripts: false,
    hasEnglishTest: false,
    hasPersonalStatement: false,
    hasReferences: false,
    financialSupport: '',
    emergencyContact: '',
    emergencyPhone: '',
    notes: '',
    documents: {
      passport: { type: 'passport', file: null, status: 'pending' },
      transcripts: { type: 'transcripts', file: null, status: 'pending' },
      englishTest: { type: 'englishTest', file: null, status: 'pending' },
      personalStatement: { type: 'personalStatement', file: null, status: 'pending' },
      references: { type: 'references', file: null, status: 'pending' }
    }
  });

  // Sample data
  const students: Student[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      country: 'Nigeria',
      course: 'MSc Computer Science',
      university: 'University of Manchester',
      status: 'Application Submitted',
      stage: 2,
      leadScore: 85,
      phone: '+234 901 234 5678',
      englishLevel: 'IELTS 7.0',
      intake: 'September 2025'
    },
    {
      id: 2,
      name: 'Ahmed Hassan',
      email: 'ahmed.hassan@email.com',
      country: 'Egypt',
      course: 'MBA',
      university: 'Imperial College London',
      status: 'Offer Received',
      stage: 3,
      leadScore: 92,
      phone: '+20 12 345 6789',
      englishLevel: 'TOEFL 95',
      intake: 'January 2026'
    },
    {
      id: 3,
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      country: 'India',
      course: 'BSc Engineering',
      university: 'University of Cambridge',
      status: 'Visa Processing',
      stage: 4,
      leadScore: 78,
      phone: '+91 98765 43210',
      englishLevel: 'IELTS 6.5',
      intake: 'September 2025'
    }
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'New Inquiry': 'bg-blue-100 text-blue-800',
      'Application Submitted': 'bg-yellow-100 text-yellow-800',
      'Offer Received': 'bg-green-100 text-green-800',
      'Visa Processing': 'bg-purple-100 text-purple-800',
      'Enrolled': 'bg-emerald-100 text-emerald-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally submit to your backend
    console.log('Application submitted:', formData);
    setShowApplicationForm(false);
    // Reset form
    setFormData({
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
      hasPassport: false,
      hasTranscripts: false,
      hasEnglishTest: false,
      hasPersonalStatement: false,
      hasReferences: false,
      financialSupport: '',
      emergencyContact: '',
      emergencyPhone: '',
      notes: '',
      documents: {
        passport: { type: 'passport', file: null, status: 'pending' },
        transcripts: { type: 'transcripts', file: null, status: 'pending' },
        englishTest: { type: 'englishTest', file: null, status: 'pending' },
        personalStatement: { type: 'personalStatement', file: null, status: 'pending' },
        references: { type: 'references', file: null, status: 'pending' }
      }
    });
  };

  const handleShareLink = () => {
    setShowShareDialog(true);
    // In a real application, you would generate a unique registration link
    const registrationLink = `${window.location.origin}/apply?ref=ADMIN123`;
    navigator.clipboard.writeText(registrationLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = async (type: keyof FormData['documents'], file: File) => {
    try {
      // Simulate file upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [type]: {
            type,
            file,
            status: 'uploaded'
          }
        }
      }));
    } catch (error) {
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [type]: {
            type,
            file: null,
            status: 'error',
            error: 'Failed to upload file'
          }
        }
      }));
    }
  };

  const handleFileRemove = (type: keyof FormData['documents']) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [type]: {
          type,
          file: null,
          status: 'pending'
        }
      }
    }));
  };

  const ShareDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Share Registration Link</CardTitle>
            <Button
              variant="ghost"
              onClick={() => setShowShareDialog(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <span className="text-2xl text-gray-500">&times;</span>
            </Button>
            </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Share this link with potential students to allow them to register and submit their applications.
            </p>
            <div className="flex items-center space-x-2">
              <Input
                value={`${window.location.origin}/apply?ref=ADMIN123`}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/apply?ref=ADMIN123`);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
          </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <AlertCircle className="h-4 w-4" />
              <span>This link will expire in 7 days</span>
        </div>
            </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setShowShareDialog(false)}>
            Close
          </Button>
          <Button onClick={() => {
            // In a real application, you would implement email sharing
            alert('Email sharing functionality would be implemented here');
          }}>
            Share via Email
          </Button>
        </CardFooter>
      </Card>
          </div>
  );

  const AdminDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">847</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73%</div>
            <p className="text-xs text-muted-foreground">
              +4.2% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Visas</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground">
              +12 new this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-muted-foreground">
              +8 new applications
            </p>
          </CardContent>
        </Card>
        </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                onClick={() => setShowApplicationForm(true)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Student Manually
              </Button>
              <Button 
                onClick={handleShareLink}
                variant="outline"
                className="w-full"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Registration Link
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'New Application', student: 'John Doe', time: '2 hours ago' },
                { action: 'Document Uploaded', student: 'Sarah Smith', time: '4 hours ago' },
                { action: 'Application Status Updated', student: 'Mike Johnson', time: '1 day ago' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.student}</p>
            </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
          </div>
              ))}
        </div>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Applications</CardTitle>
            <div className="flex space-x-3">
              <Button 
                onClick={() => setShowApplicationForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-500">Student</th>
                <th className="text-left py-3 px-6 font-medium text-gray-500">Course</th>
                <th className="text-left py-3 px-6 font-medium text-gray-500">University</th>
                <th className="text-left py-3 px-6 font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-500">Lead Score</th>
                <th className="text-left py-3 px-6 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                        {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-500">{student.country}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-medium text-gray-900">{student.course}</p>
                    <p className="text-sm text-gray-500">{student.intake}</p>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{student.university}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${student.leadScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{student.leadScore}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                        <Button 
                          variant="ghost"
                          size="icon"
                        onClick={() => setSelectedStudent(student)}
                      >
                        <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                        <MessageSquare className="h-4 w-4" />
                        </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </CardContent>
      </Card>
    </div>
  );

  const StudentDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <CardHeader>
          <CardTitle className="text-3xl">Welcome back, Sarah!</CardTitle>
          <CardDescription className="text-blue-100">
            Your application is progressing well. Here&apos;s your latest update.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Progress Tracker */}
      <Card>
        <CardHeader>
          <CardTitle>Application Progress</CardTitle>
        </CardHeader>
        <CardContent>
        <div className="flex items-center justify-between mb-4">
          {[
            { step: 1, label: 'Application Submitted', completed: true },
            { step: 2, label: 'Documents Verified', completed: true },
            { step: 3, label: 'Offer Received', completed: false, current: true },
            { step: 4, label: 'Visa Processing', completed: false },
            { step: 5, label: 'Enrollment Confirmed', completed: false }
          ].map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium mb-2 ${
                item.completed ? 'bg-green-500 text-white' : 
                item.current ? 'bg-blue-500 text-white' : 
                'bg-gray-200 text-gray-500'
              }`}>
                {item.completed ? <CheckCircle className="h-5 w-5" /> : item.step}
              </div>
              <p className={`text-xs text-center ${item.current ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                {item.label}
              </p>
              {index < 4 && (
                <div className={`absolute h-0.5 w-16 mt-5 ${item.completed ? 'bg-green-500' : 'bg-gray-200'}`} 
                     style={{ marginLeft: '3rem' }} />
              )}
            </div>
          ))}
        </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
          <div className="flex items-center mb-4">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>Document Upload</CardTitle>
                <CardDescription>Upload your required documents</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Passport Copy', status: 'uploaded', icon: <CheckCircle className="h-5 w-5 text-green-500" /> },
                { label: 'Academic Transcripts', status: 'pending', icon: <Clock className="h-5 w-5 text-yellow-500" /> },
                { label: 'English Test Scores', status: 'uploaded', icon: <CheckCircle className="h-5 w-5 text-green-500" /> },
                { label: 'Personal Statement', status: 'missing', icon: <AlertCircle className="h-5 w-5 text-red-500" /> }
              ].map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    {doc.icon}
                    <span className="ml-3 text-gray-700">{doc.label}</span>
                  </div>
                  <Button variant="link" className="text-blue-600 hover:text-blue-700">
                    {doc.status === 'uploaded' ? 'View' : 'Upload'}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>Communications with your advisor</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { 
                  sender: 'Admission Advisor',
                  message: 'Your application has been reviewed. Please upload your personal statement.',
                  time: '2 hours ago',
                  unread: true
                },
                {
                  sender: 'Visa Support',
                  message: 'Your visa application is being processed. We will update you soon.',
                  time: '1 day ago',
                  unread: false
                }
              ].map((msg, index) => (
                <div key={index} className={`p-4 rounded-lg ${msg.unread ? 'bg-blue-50' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{msg.sender}</span>
                    <span className="text-sm text-gray-500">{msg.time}</span>
                  </div>
                  <p className="text-gray-700">{msg.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center mb-4">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle>Important Dates</CardTitle>
                <CardDescription>Upcoming deadlines and events</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: 'March 15, 2024', event: 'Personal Statement Deadline', status: 'upcoming' },
                { date: 'April 1, 2024', event: 'Visa Application Deadline', status: 'upcoming' },
                { date: 'May 15, 2024', event: 'Course Start Date', status: 'confirmed' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.event}</p>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {item.status === 'confirmed' ? 'Confirmed' : 'Upcoming'}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Student CRM</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Button
                  variant={activeView === 'dashboard' ? 'default' : 'ghost'}
                  onClick={() => setActiveView('dashboard')}
                  className="inline-flex items-center"
                >
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant={activeView === 'students' ? 'default' : 'ghost'}
                  onClick={() => setActiveView('students')}
                  className="inline-flex items-center"
                >
                  <Users className="h-5 w-5 mr-2" />
                  Students
                </Button>
                <Button
                  variant={activeView === 'application' ? 'default' : 'ghost'}
                  onClick={() => setActiveView('application')}
                  className="inline-flex items-center"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Applications
                </Button>
                <Button
                  variant="ghost"
                  className="inline-flex items-center"
                >
                  <Settings className="h-5 w-5 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
            <div className="flex items-center">
              <Button variant="ghost" size="icon">
                <Search className="h-6 w-6" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-6 w-6" />
              </Button>
              <div className="ml-4 flex items-center">
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                  SJ
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === 'dashboard' && <AdminDashboard />}
        {activeView === 'students' && <StudentDashboard />}
        {activeView === 'application' && <ApplicationForm onClose={() => {}} onSubmit={() => {}} />}
        {showApplicationForm && <ApplicationForm onClose={() => {}} onSubmit={() => {}} />}
        {showShareDialog && <ShareDialog />}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CRMDemo;