"use client";

import { RegistrationForm } from "@/components/registration-form";
import { StepperNavbar, defaultRegistrationSteps } from "@/components/ui/resizable-navbar";
import { UserPlus } from "lucide-react";
import { useState } from "react";

export default function RegisterPage() {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    if (activeStep < defaultRegistrationSteps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleSkip = () => {
    if (activeStep < defaultRegistrationSteps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const isStepOptional = (step: number) => {
    return defaultRegistrationSteps[step]?.optional || false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Sticky Stepper Navbar */}
      <StepperNavbar 
        steps={defaultRegistrationSteps} 
        activeStep={activeStep} 
      />

      {/* Main Content */}
      <div className="pt-4 pb-8">
        <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="p-3 rounded-full bg-primary/10">
                <UserPlus className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold text-foreground">
                NEW USER REGISTRATION
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Complete the registration process to create a new user account. 
              All fields marked with * are required.
            </p>
          </div>

          {/* Registration Form */}
          <RegistrationForm
            currentStep={activeStep}
            onNext={handleNext}
            onBack={handleBack}
            onStepChange={setActiveStep}
            totalSteps={defaultRegistrationSteps.length}
          />

          {/* Footer Note */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Need help? Contact our support team at{" "}
              <a href="mailto:support@smarttourist.com" className="text-primary hover:underline">
                support@smarttourist.com
              </a>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
