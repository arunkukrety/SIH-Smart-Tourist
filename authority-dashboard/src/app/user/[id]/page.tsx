"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Calendar, Shield, Navigation, FileText } from "lucide-react";
import { TouristCard, type TouristData } from "@/components/tourist-card";
import { Button } from "@/components/ui/button";
import mockTouristsData from "@/data/mock-tourists.json";
import { useState, useEffect } from "react";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [tourist, setTourist] = useState<TouristData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = params.id as string;
    const foundTourist = mockTouristsData.tourists.find(t => t.id === userId);
    
    if (foundTourist) {
      setTourist(foundTourist);
    }
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading tourist details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tourist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">Tourist Not Found</h2>
              <p className="text-muted-foreground mb-4">The tourist you&apos;re looking for doesn&apos;t exist or has been removed.</p>
              <Button onClick={() => router.push('/search')} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tourist Details</h1>
            <p className="text-muted-foreground">Complete information for {tourist.full_name}</p>
          </div>
        </div>

        {/* Tourist Card */}
        <TouristCard tourist={tourist} />

        {/* Additional Actions */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            Track Location
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security Check
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Meeting
          </Button>
        </div>
      </div>
    </div>
  );
}
