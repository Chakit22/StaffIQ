"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useApplication from "@/hooks/useApplication";
import useAI from "@/hooks/useAI";
import { MyApplication } from "@/types/Application";
import { toast } from "sonner";
import LoaderComponent from "./Loading";
import ResumeInsights from "./ResumeInsights";
import {
  ClipboardList,
  Eye,
  Users,
  ChevronDown,
  ChevronUp,
  Upload,
  FileText,
  Sparkles,
  Loader2,
  X,
} from "lucide-react";

interface MyApplicationsProps {
  userId: string;
}

export default function MyApplications({ userId }: MyApplicationsProps) {
  const { getMyApplications, uploadResume } = useApplication();
  const { getResumeInsights } = useAI();
  const [applications, setApplications] = useState<MyApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [insightsFor, setInsightsFor] = useState<string | null>(null);
  const [insightsData, setInsightsData] = useState<Record<string, {
    score: number | null;
    strengths: string[];
    gaps: string[];
    suggestions: string[];
    noData?: boolean;
  }>>({});
  const [loadingInsights, setLoadingInsights] = useState<Record<string, boolean>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (userId) {
      fetchApplications();
    }
  }, [userId]);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const response = await getMyApplications();
      if (response.success) {
        setApplications(response.body as MyApplication[]);
      } else {
        toast.error(response.message || "Failed to fetch applications");
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("An error occurred while fetching applications");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleUploadResume = async (appId: string, file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    setUploadingFor(appId);
    try {
      const response = await uploadResume(appId, file);
      if (response.success) {
        toast.success("Resume uploaded successfully!");
        await fetchApplications();
      } else {
        toast.error(response.message || "Failed to upload resume");
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error("An error occurred while uploading");
    } finally {
      setUploadingFor(null);
    }
  };

  const handleGetInsights = async (appId: string) => {
    if (insightsData[appId]) {
      setInsightsFor(insightsFor === appId ? null : appId);
      return;
    }

    setLoadingInsights((prev) => ({ ...prev, [appId]: true }));
    try {
      const response = await getResumeInsights(appId);
      if (response.success && response.body) {
        setInsightsData((prev) => ({ ...prev, [appId]: response.body! }));
        setInsightsFor(appId);
      } else {
        toast.error(response.message || "Failed to get insights");
      }
    } catch (error) {
      console.error("Error getting insights:", error);
      toast.error("An error occurred while getting insights");
    } finally {
      setLoadingInsights((prev) => ({ ...prev, [appId]: false }));
    }
  };

  const getStatusInfo = (app: MyApplication) => {
    if (app.rankingCount === 0) {
      return {
        label: "Pending",
        variant: "secondary" as const,
        icon: <ClipboardList className="h-3.5 w-3.5" />,
      };
    }
    return {
      label: "Under Review",
      variant: "default" as const,
      icon: <Eye className="h-3.5 w-3.5" />,
    };
  };

  if (isLoading) {
    return <LoaderComponent />;
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">No applications yet</p>
        <p className="text-sm">Submit your first application using the form.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {applications.map((app) => {
        const status = getStatusInfo(app);
        const isExpanded = expandedCards.has(app.id);

        return (
          <Card
            key={app.id}
            className="shadow-md hover:shadow-xl transition-shadow duration-200"
          >
            <CardContent className="p-5 flex flex-col gap-3">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-bold">
                    {app.course.course_code} - {app.course.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {app.role.name}
                  </div>
                </div>
                <Badge variant={status.variant} className="flex items-center gap-1">
                  {status.icon}
                  {status.label}
                </Badge>
              </div>

              {/* Availability */}
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  Availability
                </div>
                <div className="text-sm">{app.availability.availability}</div>
              </div>

              {/* Skills */}
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  Skills
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {app.skills.map((skill, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Academic Credentials */}
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wide">
                  Academic Credentials
                </div>
                <div className="text-sm">{app.academic_creds}</div>
              </div>

              {/* Cover Letter */}
              {app.cover_letter && (
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    Cover Letter
                  </div>
                  <div className="text-sm whitespace-pre-wrap">
                    {isExpanded
                      ? app.cover_letter
                      : app.cover_letter.length > 150
                        ? `${app.cover_letter.substring(0, 150)}...`
                        : app.cover_letter}
                  </div>
                  {app.cover_letter.length > 150 && (
                    <button
                      onClick={() => toggleExpand(app.id)}
                      className="text-xs text-primary hover:underline mt-1 flex items-center gap-0.5"
                    >
                      {isExpanded ? (
                        <>Show less <ChevronUp className="h-3 w-3" /></>
                      ) : (
                        <>Show more <ChevronDown className="h-3 w-3" /></>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Resume Section */}
              <div className="border-t border-border pt-3 mt-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {app.resume_path ? "Resume uploaded" : "No resume"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Upload button */}
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      ref={(el) => { fileInputRefs.current[app.id] = el; }}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadResume(app.id, file);
                        e.target.value = "";
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRefs.current[app.id]?.click()}
                      disabled={uploadingFor === app.id}
                      className="text-xs"
                    >
                      {uploadingFor === app.id ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : (
                        <Upload className="h-3 w-3 mr-1" />
                      )}
                      {app.resume_path ? "Replace" : "Upload"}
                    </Button>

                    {/* AI Insights button */}
                    {(app.resume_path || app.cover_letter) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGetInsights(app.id)}
                        disabled={loadingInsights[app.id]}
                        className="text-xs text-accent border-accent/30 hover:bg-accent/10"
                      >
                        {loadingInsights[app.id] ? (
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        ) : (
                          <Sparkles className="h-3 w-3 mr-1" />
                        )}
                        AI Insights
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* AI Insights Display */}
              {insightsFor === app.id && insightsData[app.id] && (
                <div className="mt-2 p-4 bg-card border border-border rounded-lg relative">
                  <button
                    onClick={() => setInsightsFor(null)}
                    className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <ResumeInsights {...insightsData[app.id]} />
                </div>
              )}

              {/* Rankings Info */}
              {app.rankingCount > 0 && (
                <div className="border-t border-border pt-3 mt-1">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>
                      Ranked by {app.rankingCount} lecturer
                      {app.rankingCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
