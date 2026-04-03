"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useApplication from "@/hooks/useApplication";
import { MyApplication } from "@/types/Application";
import { toast } from "sonner";
import LoaderComponent from "./Loading";
import { ClipboardList, Eye, Users, ChevronDown, ChevronUp } from "lucide-react";

interface MyApplicationsProps {
  userId: string;
}

export default function MyApplications({ userId }: MyApplicationsProps) {
  const { getMyApplications } = useApplication();
  const [applications, setApplications] = useState<MyApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

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
                <div className="text-xs text-gray-400 uppercase tracking-wide">
                  Availability
                </div>
                <div className="text-sm">{app.availability.availability}</div>
              </div>

              {/* Skills */}
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">
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
                <div className="text-xs text-gray-400 uppercase tracking-wide">
                  Academic Credentials
                </div>
                <div className="text-sm">{app.academic_creds}</div>
              </div>

              {/* Cover Letter */}
              {app.cover_letter && (
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">
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
                      className="text-xs text-blue-500 hover:underline mt-1 flex items-center gap-0.5"
                    >
                      {isExpanded ? (
                        <>
                          Show less <ChevronUp className="h-3 w-3" />
                        </>
                      ) : (
                        <>
                          Show more <ChevronDown className="h-3 w-3" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}

              {/* Rankings Info */}
              {app.rankingCount > 0 && (
                <div className="border-t pt-3 mt-1">
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
