"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Plane, 
  Shield, 
  Clock,
  Eye,
  MessageCircle,
  Navigation,
  FileText,
  Hotel,
  CreditCard,
  MapPin as LocationPin,
  Calendar as CalendarIcon,
  PhoneCall,
  AlertTriangle,
  ExternalLink
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface TouristData {
  id: string;
  digital_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
  nationality: string;
  profile_photo: string;
  created_at: string;
  updated_at: string;
  status: string;
  contacts: {
    phone_primary: string;
    phone_secondary: string;
    email: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    emergency_contact_relation: string;
  };
  documents: {
    passport_number: string;
    passport_country: string;
    passport_issue_date: string;
    passport_expiry_date: string;
    passport_photo: string;
    visa_number: string;
    visa_type: string;
    visa_issue_date: string;
    visa_expiry_date: string;
    visa_photo: string;
  };
  addresses: Array<{
    type: string;
    country: string;
    state: string;
    city: string;
    postal_code: string;
    address_line: string;
    hotel_name: string;
    room_number: string;
    check_in_date: string;
    check_out_date: string;
    is_primary: boolean;
  }>;
  travel: {
    arrival_date: string;
    departure_date: string;
    arrival_flight: string;
    departure_flight: string;
    arrival_airport: string;
    departure_airport: string;
    travel_purpose: string;
    travel_duration_days: number;
    budget_range: string;
    travel_insurance: boolean;
  };
  recent_activities: Array<{
    type: string;
    location: string;
    latitude: number;
    longitude: number;
    description: string;
    timestamp: string;
  }>;
  security_alerts: unknown[];
}

interface TouristCardProps {
  tourist: TouristData;
  className?: string;
}

const TouristCard = React.forwardRef<HTMLDivElement, TouristCardProps>(
  ({ tourist, className }, ref) => {
    const router = useRouter();
    const currentAddress = tourist.addresses.find(addr => addr.is_primary) || tourist.addresses[0];
    const lastActivity = tourist.recent_activities[tourist.recent_activities.length - 1];

    const handleCardClick = () => {
      router.push(`/user/${tourist.id}`);
    };

    const handleContactTourist = () => {
      // Open email client
      window.open(`mailto:${tourist.contacts.email}`, '_blank');
    };

    const handleCallTourist = () => {
      // Open phone dialer
      window.open(`tel:${tourist.contacts.phone_primary}`, '_blank');
    };

    const handleUpdateLocation = () => {
      // Open location update modal or page
      alert(`Update location for ${tourist.full_name}\nCurrent location: ${currentAddress.city}, ${currentAddress.state}`);
    };

    const handleAddNote = () => {
      // Open note adding modal
      const note = prompt(`Add a note for ${tourist.full_name}:`);
      if (note) {
        alert(`Note added: "${note}"`);
      }
    };

    const handleViewDocuments = () => {
      // Open document viewer
      alert(`Viewing documents for ${tourist.full_name}\nPassport: ${tourist.documents.passport_number}\nVisa: ${tourist.documents.visa_number}`);
    };

    const handleTrackLocation = () => {
      // Open location tracking
      if (lastActivity) {
        alert(`Tracking ${tourist.full_name}\nLast seen: ${lastActivity.location}\nCoordinates: ${lastActivity.latitude}, ${lastActivity.longitude}`);
      } else {
        alert(`No recent location data for ${tourist.full_name}`);
      }
    };

    const calculateDaysRemaining = () => {
      const departure = new Date(tourist.travel.departure_date);
      const today = new Date();
      const diffTime = departure.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    };

    const formatTimeAgo = (timestamp: string) => {
      const now = new Date();
      const activityTime = new Date(timestamp);
      const diffMs = now.getTime() - activityTime.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffDays > 0) {
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else {
        return 'Just now';
      }
    };

    const getStatusColor = (status: string) => {
      return status === "active" 
        ? "bg-green-100 text-green-800 border-green-200" 
        : "bg-red-100 text-red-800 border-red-200";
    };

    const getBudgetColor = (budget: string) => {
      switch (budget.toLowerCase()) {
        case 'high':
          return 'text-green-600';
        case 'medium':
          return 'text-yellow-600';
        case 'low':
          return 'text-red-600';
        default:
          return 'text-muted-foreground';
      }
    };

    return (
      <Card 
        ref={ref} 
        className={cn("w-full max-w-4xl mx-auto cursor-pointer hover:shadow-lg transition-shadow", className)}
        onClick={handleCardClick}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24 border-2 border-border">
                <AvatarImage src={tourist.profile_photo} alt={tourist.full_name} />
                <AvatarFallback className="text-lg">
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div 
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/80 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(tourist.profile_photo, '_blank');
                }}
                title="View full size photo"
              >
                <ExternalLink className="h-3 w-3 text-primary-foreground" />
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {tourist.full_name}
                  </h1>
                  <p className="text-sm text-muted-foreground font-medium">
                    ID: {tourist.digital_id}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {tourist.nationality} • {tourist.gender}
                  </p>
                </div>
                <Badge className={cn("text-xs", getStatusColor(tourist.status))}>
                  {tourist.status}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Contact & Documents */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span>{tourist.contacts.phone_primary}</span>
                  </div>
                  {tourist.contacts.phone_secondary && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{tourist.contacts.phone_secondary}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span className="truncate">{tourist.contacts.email}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Emergency: {tourist.contacts.emergency_contact_name} ({tourist.contacts.emergency_contact_relation})
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Emergency Phone: {tourist.contacts.emergency_contact_phone}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Document Status
                </h3>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Passport: </span>
                    <span>{tourist.documents.passport_number} ({tourist.documents.passport_country})</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Issued: {formatDate(tourist.documents.passport_issue_date)} • Expires: {formatDate(tourist.documents.passport_expiry_date)}
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Visa: </span>
                    <span>{tourist.documents.visa_type} ({tourist.documents.visa_number})</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Issued: {formatDate(tourist.documents.visa_issue_date)} • Expires: {formatDate(tourist.documents.visa_expiry_date)}
                  </div>
                  <div className="mt-3">
                    <div className="text-xs text-muted-foreground mb-2">Document Photos:</div>
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div 
                          className="w-16 h-12 border rounded cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(tourist.documents.passport_photo, '_blank');
                          }}
                        >
                          <Image 
                            src={tourist.documents.passport_photo} 
                            alt="Passport" 
                            width={64}
                            height={48}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">Passport</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div 
                          className="w-16 h-12 border rounded cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(tourist.documents.visa_photo, '_blank');
                          }}
                        >
                          <Image 
                            src={tourist.documents.visa_photo} 
                            alt="Visa" 
                            width={64}
                            height={48}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">Visa</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Current Stay */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Current Location
                </h3>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Location: </span>
                    <span>{currentAddress.city}, {currentAddress.state}, {currentAddress.country}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Postal Code: {currentAddress.postal_code}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Hotel className="h-3 w-3 text-muted-foreground" />
                    <span>{currentAddress.hotel_name}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Room: </span>
                    <span>{currentAddress.room_number}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {currentAddress.address_line}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Stay Duration
                </h3>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Check-in: </span>
                    <span>{formatDate(currentAddress.check_in_date)}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Check-out: </span>
                    <span>{formatDate(currentAddress.check_out_date)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Travel Information */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                  <Plane className="h-4 w-4" />
                  Trip Overview
                </h3>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Purpose: </span>
                    <span className="capitalize">{tourist.travel.travel_purpose}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Duration: </span>
                    <span>{tourist.travel.travel_duration_days} days</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="h-3 w-3 text-muted-foreground" />
                    <span className={getBudgetColor(tourist.travel.budget_range)}>
                      {tourist.travel.budget_range} budget
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Insurance: </span>
                    <span>{tourist.travel.travel_insurance ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                  <Plane className="h-4 w-4" />
                  Flight Information
                </h3>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Arrival: </span>
                    <span>{tourist.travel.arrival_flight} to {tourist.travel.arrival_airport}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Departure: </span>
                    <span>{tourist.travel.departure_flight} from {tourist.travel.departure_airport}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Timeline
                </h3>
                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Arrival: </span>
                    <span>{formatDate(tourist.travel.arrival_date)}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Departure: </span>
                    <span>{formatDate(tourist.travel.departure_date)}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Days remaining: </span>
                    <span className="font-medium">{calculateDaysRemaining()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {tourist.recent_activities && tourist.recent_activities.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
                  <Navigation className="h-4 w-4" />
                  Recent Activities ({tourist.recent_activities.length})
                </h3>
                <div className="space-y-3">
                  {tourist.recent_activities.slice(0, 3).map((activity, index) => (
                    <div key={index} className="flex gap-3 p-2 border rounded-lg bg-muted/30">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Navigation className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="capitalize font-medium">{activity.type.replace('_', ' ')}</span>
                          <span>•</span>
                          <span className="text-muted-foreground truncate">{activity.location}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {activity.description}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{formatTimeAgo(activity.timestamp)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <LocationPin className="h-3 w-3" />
                            <span>{activity.latitude.toFixed(4)}, {activity.longitude.toFixed(4)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {tourist.recent_activities.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center">
                      +{tourist.recent_activities.length - 3} more activities
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* System Information */}
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                System Information
              </h3>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div>Created: {formatDate(tourist.created_at)}</div>
                <div>Last Updated: {formatDate(tourist.updated_at)}</div>
                <div>Date of Birth: {formatDate(tourist.date_of_birth)}</div>
              </div>
            </div>
            
            {tourist.security_alerts && tourist.security_alerts.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm text-foreground mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Security Alerts
                </h3>
                <div className="text-xs text-orange-600">
                  {tourist.security_alerts.length} alert{tourist.security_alerts.length !== 1 ? 's' : ''} active
                </div>
              </div>
            )}
          </div>

          <Separator />
          
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              className="flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
            >
              <Eye className="h-3 w-3" />
              View Full Profile
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                handleContactTourist();
              }}
            >
              <MessageCircle className="h-3 w-3" />
              Email
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                handleCallTourist();
              }}
            >
              <PhoneCall className="h-3 w-3" />
              Call
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDocuments();
              }}
            >
              <Shield className="h-3 w-3" />
              Documents
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                handleTrackLocation();
              }}
            >
              <Navigation className="h-3 w-3" />
              Track
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateLocation();
              }}
            >
              <LocationPin className="h-3 w-3" />
              Update Location
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                handleAddNote();
              }}
            >
              <FileText className="h-3 w-3" />
              Add Note
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }
);

TouristCard.displayName = "TouristCard";

export { TouristCard, type TouristData };
