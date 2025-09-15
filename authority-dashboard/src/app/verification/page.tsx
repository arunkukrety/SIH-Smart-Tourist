"use client";

import { useState } from "react";
import { ShieldCheck, Users, FileText, Eye, CheckCircle, XCircle, Calendar, Mail, Phone, MapPin, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import mockVerificationData from "@/data/mock-verification.json";

interface Document {
  id: string;
  type: 'passport' | 'visa' | 'id_card' | 'other';
  name: string;
  url: string;
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected' | 'under_review';
  metadata?: any;
}

interface PendingUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  dateOfBirth: string;
  submittedAt: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  notes?: string | null;
  documents: Document[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'under_review': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'approved': return 'bg-green-100 text-green-800 border-green-200';
    case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getDocumentTypeIcon = (type: string) => {
  switch (type) {
    case 'passport': return '🛂';
    case 'visa': return '📋';
    case 'id_card': return '🆔';
    default: return '📄';
  }
};

export default function VerificationPage() {
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [users, setUsers] = useState<PendingUser[]>(mockVerificationData.pendingUsers);
  const stats = mockVerificationData.verificationStats;

  const handleApprove = (userId: string) => {
    setUsers(prev => prev.map(user =>
      user.id === userId
        ? { ...user, status: 'approved' as const }
        : user
    ));
    setSelectedUser(null);
  };

  const handleReject = (userId: string) => {
    setUsers(prev => prev.map(user =>
      user.id === userId
        ? { ...user, status: 'rejected' as const }
        : user
    ));
    setSelectedUser(null);
  };

  const pendingUsers = users.filter(user => user.status === 'pending' || user.status === 'under_review');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-primary/10">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">USER VERIFICATION</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            review pending registrations from the issuer portal, inspect uploaded documents, and approve or reject.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-semibold text-foreground">{stats.totalPending}</p>
              </div>
              <Users className="h-6 w-6 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Under review</p>
                <p className="text-2xl font-semibold text-foreground">{stats.underReview}</p>
              </div>
              <FileText className="h-6 w-6 text-muted-foreground" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Decided</p>
                <p className="text-2xl font-semibold text-foreground">{stats.approved + stats.rejected}</p>
              </div>
              <ShieldCheck className="h-6 w-6 text-muted-foreground" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Pending Applications</h2>
            <div className="space-y-3">
              {pendingUsers.map((user) => (
                <Card
                  key={user.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedUser?.id === user.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">{user.nationality}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(user.status)}>
                        {user.status.replace('_', ' ')}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(user.submittedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {user.documents.length} documents
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">User Details</h2>
            <div className="max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
              {selectedUser ? (
                <div className="space-y-4">
                <Card className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {selectedUser.firstName} {selectedUser.lastName}
                      </h3>
                      <Badge className={getStatusColor(selectedUser.status)}>
                        {selectedUser.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedUser.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedUser.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedUser.nationality}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(selectedUser.dateOfBirth).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {selectedUser.notes && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Notes:</strong> {selectedUser.notes}
                      </p>
                    </div>
                  )}
                </Card>

                <Card className="p-6">
                  <h4 className="text-lg font-semibold text-foreground mb-4">Uploaded Documents</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {selectedUser.documents.map((doc) => (
                      <div key={doc.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{getDocumentTypeIcon(doc.type)}</span>
                            <div>
                              <h5 className="font-medium text-foreground">{doc.name}</h5>
                              <p className="text-sm text-muted-foreground">
                                Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(doc.status)}>
                            {doc.status}
                          </Badge>
                        </div>
                        <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                          <img
                            src={doc.url}
                            alt={doc.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {selectedUser.status === 'pending' || selectedUser.status === 'under_review' ? (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleApprove(selectedUser.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve User
                    </Button>
                    <Button
                      onClick={() => handleReject(selectedUser.id)}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject User
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      This user has been {selectedUser.status}
                    </p>
                  </div>
                )}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Select a user to view their details and documents</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
