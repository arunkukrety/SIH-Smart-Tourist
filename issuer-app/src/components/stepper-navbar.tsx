"use client";

import * as React from 'react';
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";

interface Step {
  id: string;
  title: string;
  description?: string;
  optional?: boolean;
}

interface StepperNavbarProps {
  steps: Step[];
  activeStep: number;
  className?: string;
}

export function StepperNavbar({ 
  steps, 
  activeStep, 
  className 
}: StepperNavbarProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = React.useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 100) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  });

  return (
    <motion.div
      ref={ref}
      className={cn("sticky inset-x-0 top-0 z-40 w-full", className)}
    >
      <motion.div
        animate={{
          backdropFilter: visible ? "blur(10px)" : "none",
          boxShadow: visible
            ? "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset"
            : "none",
          y: visible ? 10 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 50,
        }}
        className={cn(
          "relative z-[60] mx-auto w-full bg-transparent px-4 py-3",
          visible && "bg-white/80 dark:bg-neutral-950/80"
        )}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              const isCompleted = index < activeStep;
              const isSkipped = false;
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                        isCompleted && !isSkipped
                          ? "border-primary bg-primary text-primary-foreground"
                          : isActive
                          ? "border-primary bg-background text-primary"
                          : "border-muted-foreground bg-background text-muted-foreground"
                      )}
                    >
                      {isCompleted && !isSkipped ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <span className="text-xs font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="mt-1 text-center">
                      <p className={cn(
                        "text-xs font-medium",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {step.title}
                      </p>
                      {step.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {step.description}
                        </p>
                      )}
                      {step.optional && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Optional
                        </p>
                      )}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="flex-1 mx-2">
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
      </motion.div>
    </motion.div>
  );
}

export const defaultRegistrationSteps: Step[] = [
  {
    id: "personal-info",
    title: "Personal Info",
    description: "Basic details"
  },
  {
    id: "documents",
    title: "Documents",
    description: "Upload files"
  },
  {
    id: "trip-details",
    title: "Trip Details",
    description: "Travel plans"
  },
  {
    id: "emergency-contacts",
    title: "Emergency",
    description: "Contact info"
  },
  {
    id: "review",
    title: "Review",
    description: "Final check"
  }
];
