import { Application } from "@/types/Application";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

export interface LecturerPreferencesViewProps {
  preferences: Array<{
    rank: number;
    application: Application;
  }>;
  courseName?: string;
  emptyMessage?: string;
}

/**
 * Displays lecturer preferences as a ranked list
 * Pure presentation component with no business logic
 */
export function LecturerPreferencesView({
  preferences,
  courseName,
  emptyMessage = "No preferences set for this course",
}: LecturerPreferencesViewProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-blue-700">
          My Preferences {courseName && `for ${courseName}`}
        </h3>
        <Badge
          variant="outline"
          className="bg-blue-100 text-blue-700 border-blue-200"
        >
          {preferences.length} ranked candidate
          {preferences.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {preferences.length === 0 ? (
        <Card className="p-6 text-center text-gray-500">{emptyMessage}</Card>
      ) : (
        <div className="space-y-3">
          {preferences
            .sort((a, b) => a.rank - b.rank)
            .map((preference) => (
              <Card
                key={`${preference.application.id}-${preference.rank}`}
                className="p-4 border-l-4 border-l-blue-500"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {preference.rank}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {preference.application.user.name}
                      </h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-sm text-gray-600">
                          {preference.application.role.name}
                        </span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-600">
                          {preference.application.availability.availability}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {preference.application.id.substring(0, 8)}
                    </Badge>
                  </div>
                </div>

                {preference.application.skills &&
                  preference.application.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3 ml-12">
                      {preference.application.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  )}
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
