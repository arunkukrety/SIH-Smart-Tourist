"use client";

import * as React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface BottomNavigationProps {
  activeStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onSkip?: () => void;
  onReset?: () => void;
  isStepOptional?: (step: number) => boolean;
  isStepSkipped?: (step: number) => boolean;
  className?: string;
  disabled?: boolean;
}

export function BottomNavigation({
  activeStep,
  totalSteps,
  onNext,
  onBack,
  onSkip,
  onReset,
  isStepOptional,
  isStepSkipped,
  className,
  disabled = false
}: BottomNavigationProps) {
  const isLastStep = activeStep === totalSteps - 1;
  const isFirstStep = activeStep === 0;
  const isCompleted = activeStep === totalSteps;

  if (isCompleted) {
    return (
      <div className={cn("fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t", className)}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col items-center space-y-4">
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
        </div>
      </div>
    );
  }

  return (
    <div className={cn("fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t", className)}>
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isFirstStep || disabled}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            {onSkip && isStepOptional && isStepOptional(activeStep) && (
              <Button
                variant="ghost"
                onClick={onSkip}
                className="text-muted-foreground"
                disabled={disabled}
              >
                Skip
              </Button>
            )}
            <Button
              onClick={onNext}
              disabled={disabled}
              className="flex items-center gap-2"
            >
              {isLastStep ? "Finish" : "Next"}
              {!isLastStep && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
