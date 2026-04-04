"use client";

import { ApplicationStatus } from "@/types/Application";
import { Check } from "lucide-react";

const STEPS: { key: ApplicationStatus; label: string }[] = [
  { key: "applied", label: "Applied" },
  { key: "under_review", label: "Under Review" },
  { key: "shortlisted", label: "Shortlisted" },
  { key: "interview", label: "Interview" },
  { key: "offered", label: "Offered" },
  { key: "accepted", label: "Accepted" },
];

interface ApplicationProgressProps {
  status: ApplicationStatus;
}

export default function ApplicationProgress({ status }: ApplicationProgressProps) {
  if (status === "rejected") {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20">
        <div className="h-2.5 w-2.5 rounded-full bg-destructive" />
        <span className="text-sm font-medium text-destructive">
          Application Rejected
        </span>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return (
    <div className="flex items-center w-full gap-1">
      {STEPS.map((step, index) => {
        const isPast = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isFuture = index > currentIndex;

        return (
          <div key={step.key} className="flex items-center flex-1 min-w-0">
            {/* Step indicator */}
            <div className="flex flex-col items-center gap-1 min-w-0">
              <div
                className={`
                  flex items-center justify-center h-6 w-6 rounded-full text-xs font-bold shrink-0
                  ${isPast ? "bg-green-500 text-white" : ""}
                  ${isCurrent ? "bg-primary text-primary-foreground ring-2 ring-primary/30" : ""}
                  ${isFuture ? "bg-muted text-muted-foreground" : ""}
                `}
              >
                {isPast ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </div>
              <span
                className={`
                  text-[10px] leading-tight text-center truncate max-w-full
                  ${isCurrent ? "text-primary font-semibold" : ""}
                  ${isPast ? "text-green-500" : ""}
                  ${isFuture ? "text-muted-foreground" : ""}
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {index < STEPS.length - 1 && (
              <div
                className={`
                  flex-1 h-0.5 mx-1 mt-[-16px]
                  ${index < currentIndex ? "bg-green-500" : "bg-muted"}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
