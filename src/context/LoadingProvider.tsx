"use client";
import React, { createContext, useContext, useState } from "react";

type LoadingKeys =
  | "courseLoading"
  | "userLoading"
  | "applicantsLoading"
  | "rankingLoading";
type LoadingMap = Record<LoadingKeys, boolean>;

// Context Props
interface LoadingContextType {
  loadingStates: LoadingMap;
  setLoading: (key: string, value: boolean) => void;
}

// Create conetxt
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Creat a provider
export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // define loading states
  const [loadingStates, setLoading] = useState<Record<LoadingKeys, boolean>>({
    courseLoading: true,
    userLoading: true,
    applicantsLoading: true,
    rankingLoading: true,
  });

  // console.log("Inside Loading Provider!");

  // A new way to define loading
  /**
   * Here as we know setLoading is a normal state setting variable but because our setLoading is different we define that type and write the execution
   * of that loading.
   */
  return (
    <LoadingContext.Provider
      value={{
        loadingStates,
        setLoading: (key: string, value: boolean) => {
          setLoading((prev) => ({
            ...prev,
            [key]: value,
          }));
        },
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
};

// Consuming a context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useRanking must be used within a RankingProvider");
  }
  return context;
};
