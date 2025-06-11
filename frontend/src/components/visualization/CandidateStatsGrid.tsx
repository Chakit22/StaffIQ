/**
 * VISUALIZATION COMPONENT - Pure Presentation Layer
 *
 * This component follows the Presentation Component pattern, focusing solely on
 * rendering data passed to it as props without any business logic or data fetching.
 *
 * ARCHITECTURAL BENEFITS:
 * 1. PURE FUNCTION: Component is predictable - same props always produce same output
 * 2. REUSABLE: Can display any candidate data regardless of source (most/least/unchosen)
 * 3. TESTABLE: Easy to test with mock data, no dependencies on external APIs
 * 4. MAINTAINABLE: Changes to data fetching logic don't affect this component
 */

import { Application } from "@/types/Application";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

export interface CandidateStatsGridProps {
  title: string;
  candidates: Application[];
  categoryColor: "green" | "yellow" | "gray";
  emptyMessage?: string;
}

/**
 * Pure presentation component that renders candidate data in a grid layout
 * Contains no business logic, only visual presentation concerns
 */
export function CandidateStatsGrid({
  title,
  candidates,
  categoryColor,
  emptyMessage = "No candidates in this category",
}: CandidateStatsGridProps) {
  const colorClasses = {
    green: "bg-green-100 text-green-700 border-green-200",
    yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
    gray: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-blue-700">{title}</h3>
        <Badge variant="outline" className={colorClasses[categoryColor]}>
          {candidates.length} candidate{candidates.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {candidates.length === 0 ? (
        <Card className="p-6 text-center text-gray-500">{emptyMessage}</Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidates.map((candidate) => (
            <Card
              key={candidate.id}
              className="p-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-900">
                    {candidate.user.name}
                  </h4>
                  <Badge variant="secondary">
                    {candidate.id.substring(0, 8)}
                  </Badge>
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Course:</span>{" "}
                    {candidate.course.name}
                  </div>
                  <div>
                    <span className="font-medium">Role:</span>{" "}
                    {candidate.role.name}
                  </div>
                  <div>
                    <span className="font-medium">Availability:</span>{" "}
                    {candidate.availability.availability}
                  </div>
                </div>

                {candidate.skills && candidate.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {candidate.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                )}

                {candidate.academic_creds && (
                  <div className="text-xs text-gray-500 mt-2">
                    <span className="font-medium">Credentials:</span>{" "}
                    {candidate.academic_creds}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
