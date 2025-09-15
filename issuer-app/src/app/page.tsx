"use client";

import { UserPlus, Users, Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  const quickActions = [
    {
      title: "Register New User",
      description: "Create a new user account with complete registration process",
      href: "/register",
      icon: UserPlus,
      color: "bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200",
      iconColor: "text-black dark:text-white"
    },
    {
      title: "View Users",
      description: "Browse and manage existing user accounts and their information",
      href: "/users", 
      icon: Users,
      color: "bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200",
      iconColor: "text-black dark:text-white"
    },
    {
      title: "Check Status",
      description: "Monitor application status and verification progress",
      href: "/status",
      icon: Activity,
      color: "bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200", 
      iconColor: "text-black dark:text-white"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-primary/10">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">
              ISSUER PORTAL
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Welcome to the Smart Tourist Issuer Portal. Manage user registrations, 
            view accounts, and monitor application status.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className={`p-4 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className={`h-8 w-8 ${action.iconColor}`} />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-foreground">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </div>

                    <Link href={action.href} className="w-full">
                      <Button 
                        className={`w-full ${action.color} text-white dark:text-black group-hover:shadow-md transition-all duration-300`}
                      >
                        <span>Get Started</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="text-center space-y-4">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Need Help?
              </h3>
              <p className="text-sm text-muted-foreground">
                If you need assistance with any of these features, please contact our support team at{" "}
                <a href="mailto:support@smarttourist.com" className="text-primary hover:underline">
                  support@smarttourist.com
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
