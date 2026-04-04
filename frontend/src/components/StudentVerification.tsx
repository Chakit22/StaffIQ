import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import apiClient from "@/api/client";

type VerificationStep = "form" | "pending" | "success" | "failed";

interface StudentVerificationProps {
  userId: string;
  userEmail: string;
  userName: string;
  onVerified: () => void;
}

export default function StudentVerification({
  userId,
  userEmail,
  userName,
  onVerified,
}: StudentVerificationProps) {
  const [step, setStep] = useState<VerificationStep>("form");
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [university, setUniversity] = useState("RMIT University");
  const [graduationYear, setGraduationYear] = useState(new Date().getFullYear() + 1);
  const [birthDate, setBirthDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Split name into first/last
  const nameParts = userName.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await apiClient.post("/api/auth/verify-student", {
        userId,
        firstName,
        lastName,
        email: userEmail,
        birthDate,
        university,
        graduationYear,
      });

      const { verificationId: vId, status } = response.data.body;
      setVerificationId(vId);

      if (status === "success" || vId === "dev-bypass") {
        setStep("success");
      } else {
        setStep("pending");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Verification failed. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const pollStatus = useCallback(async () => {
    if (!verificationId || verificationId === "dev-bypass") return;

    try {
      const response = await apiClient.get(
        `/api/auth/verification-status/${verificationId}?userId=${userId}`,
      );
      const { status } = response.data.body;

      if (status === "success") {
        setStep("success");
      } else if (status === "error" || status === "rejected") {
        setStep("failed");
      }
    } catch {
      // Silently retry on next poll
    }
  }, [verificationId, userId]);

  useEffect(() => {
    if (step !== "pending") return;

    const interval = setInterval(pollStatus, 3000);
    return () => clearInterval(interval);
  }, [step, pollStatus]);

  if (step === "success") {
    return (
      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <Card className="max-w-md mx-auto p-6 text-center border-border bg-card/80 backdrop-blur-xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Student Verified</h3>
          <p className="text-muted-foreground mb-4">
            Your student status has been confirmed. You can now sign in.
          </p>
          <Button onClick={onVerified} className="w-full glow-purple-sm">
            Continue to Sign In
          </Button>
        </Card>
      </motion.div>
    );
  }

  if (step === "pending") {
    return (
      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <Card className="max-w-md mx-auto p-6 text-center border-border bg-card/80 backdrop-blur-xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Verifying...</h3>
          <p className="text-muted-foreground">
            We are verifying your student status with SheerID. This may take a moment.
          </p>
        </Card>
      </motion.div>
    );
  }

  if (step === "failed") {
    return (
      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <Card className="max-w-md mx-auto p-6 text-center border-border bg-card/80 backdrop-blur-xl">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Verification Failed</h3>
          <p className="text-muted-foreground mb-4">
            We could not verify your student status. Please try again.
          </p>
          <Button
            onClick={() => {
              setStep("form");
              setVerificationId(null);
              setError(null);
            }}
            className="w-full glow-purple-sm"
          >
            Try Again
          </Button>
        </Card>
      </motion.div>
    );
  }

  // Form step
  return (
    <motion.div variants={fadeInUp} initial="initial" animate="animate">
      <Card className="max-w-md mx-auto p-6 border-border bg-card/80 backdrop-blur-xl">
        <h3 className="text-xl font-bold text-foreground mb-1">Student Verification</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Verify your student status to complete registration.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="university">University</Label>
            <Input
              id="university"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="Your university"
              required
            />
          </div>

          <div>
            <Label htmlFor="graduationYear">Expected Graduation Year</Label>
            <Input
              id="graduationYear"
              type="number"
              value={graduationYear}
              onChange={(e) => setGraduationYear(Number(e.target.value))}
              min={new Date().getFullYear()}
              max={new Date().getFullYear() + 6}
              required
            />
          </div>

          <div>
            <Label htmlFor="birthDate">Date of Birth</Label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full glow-purple-sm" disabled={submitting}>
            {submitting ? "Verifying..." : "Verify Student Status"}
          </Button>
        </form>
      </Card>
    </motion.div>
  );
}
