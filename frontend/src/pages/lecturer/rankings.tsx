"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/UserProvider";
import useApplication from "@/hooks/useApplication";
import { Application } from "@/types/Application";
import { ApplicationRankingEditor } from "@/components/ApplicationRankingEditor";
import Layout from "@/components/layout";
import LoaderComponent from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function RankingsPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const { getLecturerRankings } = useApplication();
  const [rankedApplications, setRankedApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/signin");
      return;
    }
    fetchRankings();
  }, [user, loading]);

  const fetchRankings = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const response = await getLecturerRankings(user.id);
      if (response.success && Array.isArray(response.body)) {
        const rankings = response.body;
        const rankedApps: Application[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rankings.forEach((ranking: any) => {
          if (ranking.application) {
            rankedApps.push(ranking.application);
          }
        });
        rankedApps.sort((a, b) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rankA = rankings.find((r: any) => r.application.id === a.id)?.rank || 0;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rankB = rankings.find((r: any) => r.application.id === b.id)?.rank || 0;
          return rankA - rankB;
        });
        setRankedApplications(rankedApps);
      }
    } catch (error) {
      console.error("Error fetching rankings:", error);
      toast.error("Failed to load rankings");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || isLoading) return <LoaderComponent />;
  if (!user) return null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/lecturer?id=${user.id}`)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Applications
          </Button>
        </div>

        <div>
          <h1 className="text-2xl font-bold">My Rankings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Drag and drop to reorder candidates. Use AI suggestions for smart ranking.
          </p>
        </div>

        <ApplicationRankingEditor
          lecturerId={user.id}
          rankedApplications={rankedApplications}
          onRankingsChanged={fetchRankings}
        />
      </div>
    </Layout>
  );
}
