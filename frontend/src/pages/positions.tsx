"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/UserProvider";
import usePosition from "@/hooks/usePosition";
import { Position } from "@/types/Position";
import PositionCard from "@/components/PositionCard";
import LoaderComponent from "@/components/Loading";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animations";
import { Search, Briefcase } from "lucide-react";
import { useQueryState, parseAsString } from "nuqs";

export default function PositionsPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  const { getAllPositions } = usePosition();

  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault(""),
  );

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/signin");
      return;
    }
    if (!loading && user) {
      fetchPositions();
    }
  }, [loading, user]);

  const fetchPositions = async () => {
    try {
      setIsLoading(true);
      const response = await getAllPositions();
      if (response.success) {
        setPositions(response.body as Position[]);
      } else {
        toast.error(response.message || "Failed to fetch positions");
      }
    } catch (error) {
      console.error("Error fetching positions:", error);
      toast.error("An error occurred while fetching positions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = (position: Position) => {
    // Navigate to candidate page with pre-filled query params
    router.push(
      `/candidate?courseId=${position.courseId}&roleId=${position.roleId}&positionId=${position.id}`,
    );
  };

  if (loading || isLoading) {
    return <LoaderComponent />;
  }

  if (!user) {
    return null;
  }

  const filteredPositions = positions.filter((p) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(term) ||
      p.course.name.toLowerCase().includes(term) ||
      p.course.course_code.toLowerCase().includes(term) ||
      p.role.name.toLowerCase().includes(term) ||
      (p.description && p.description.toLowerCase().includes(term))
    );
  });

  return (
    <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
      >
        <div className="flex items-center gap-3 mb-2">
          <Briefcase className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold">Open Positions</h1>
        </div>
        <p className="text-muted-foreground">
          Browse and apply for available tutor and teaching assistant positions
        </p>
      </motion.div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search positions by title, course, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Positions grid */}
      {filteredPositions.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium">No open positions</p>
          <p className="text-sm">
            {search
              ? "Try adjusting your search terms"
              : "Check back later for new opportunities"}
          </p>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredPositions.map((position) => (
            <PositionCard
              key={position.id}
              position={position}
              onApply={handleApply}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
