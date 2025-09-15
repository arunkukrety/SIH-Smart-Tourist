"use client";

import * as React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight } from "lucide-react";

interface Step {
  id: string;
  title: string;
  description?: string;
  optional?: boolean;
}

interface StepperProps {
  steps: Step[];
  activeStep: number;
  onStepChange?: (step: number) => void;
  allowSkip?: boolean;
  className?: string;
}

interface StepperControlsProps {
  activeStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onSkip?: () => void;
  onReset?: () => void;
  isStepOptional?: (step: number) => boolean;
  isStepSkipped?: (step: number) => boolean;
  className?: string;
}

export function Stepper({ 
  steps, 
  activeStep, 
  onStepChange, 
  allowSkip = false,
  className 
}: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;
          const isSkipped = false; // You can implement skip logic later
          
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                    isCompleted && !isSkipped
                      ? "border-primary bg-primary text-primary-foreground"
                      : isActive
                      ? "border-primary bg-background text-primary"
                      : "border-muted-foreground bg-background text-muted-foreground"
                  )}
                >
                  {isCompleted && !isSkipped ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className={cn(
                    "text-sm font-medium",
                    isActive ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  )}
                  {step.optional && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Optional
                    </p>
                  )}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div className={cn(
                    "h-0.5 w-full transition-colors",
                    index < activeStep ? "bg-primary" : "bg-muted"
                  )} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export function StepperControls({
  activeStep,
  totalSteps,
  onNext,
  onBack,
  onSkip,
  onReset,
  isStepOptional,
  isStepSkipped,
  className
}: StepperControlsProps) {
  const isLastStep = activeStep === totalSteps - 1;
  const isFirstStep = activeStep === 0;
  const isCompleted = activeStep === totalSteps;

  if (isCompleted) {
    return (
      <div className={cn("flex flex-col items-center space-y-4 pt-6", className)}>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">
            All steps completed!
          </h3>
          <p className="text-muted-foreground">
            You have successfully completed the registration process.
          </p>
        </div>
        {onReset && (
          <Button onClick={onReset} variant="outline">
            Start Over
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-between pt-6", className)}>
      <Button
        variant="outline"
        onClick={onBack}
        disabled={isFirstStep}
        className="flex items-center gap-2"
      >
        Back
      </Button>

      <div className="flex items-center gap-2">
        {onSkip && isStepOptional && isStepOptional(activeStep) && (
          <Button
            variant="ghost"
            onClick={onSkip}
            className="text-muted-foreground"
          >
            Skip
          </Button>
        )}
        <Button
          onClick={onNext}
          className="flex items-center gap-2"
        >
          {isLastStep ? "Finish" : "Next"}
          {!isLastStep && <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}

// Main stepper component that combines both
export function MultiStepStepper({
  steps,
  activeStep,
  onStepChange,
  onNext,
  onBack,
  onSkip,
  onReset,
  allowSkip = false,
  className
}: StepperProps & {
  onNext: () => void;
  onBack: () => void;
  onSkip?: () => void;
  onReset?: () => void;
}) {
  const isStepOptional = (step: number) => {
    return steps[step]?.optional || false;
  };

  const isStepSkipped = (step: number) => {
    return false; // Implement skip logic if needed
  };

  return (
    <div className={cn("w-full space-y-6", className)}>
      <Stepper
        steps={steps}
        activeStep={activeStep}
        onStepChange={onStepChange}
        allowSkip={allowSkip}
      />
      
      <StepperControls
        activeStep={activeStep}
        totalSteps={steps.length}
        onNext={onNext}
        onBack={onBack}
        onSkip={onSkip}
        onReset={onReset}
        isStepOptional={isStepOptional}
        isStepSkipped={isStepSkipped}
      />
    </div>
  );
}

// Default 5-step configuration for user registration
export const defaultRegistrationSteps: Step[] = [
  {
    id: "personal-info",
    title: "Personal Information",
    description: "Basic details and contact info"
  },
  {
    id: "documents",
    title: "Document Upload",
    description: "Passport and identification"
  },
  {
    id: "trip-details",
    title: "Trip Details",
    description: "Travel plans and itinerary"
  },
  {
    id: "emergency-contacts",
    title: "Emergency Contacts",
    description: "Emergency contact information"
  },
  {
    id: "review",
    title: "Review & Submit",
    description: "Final review and submission"
  }
];
