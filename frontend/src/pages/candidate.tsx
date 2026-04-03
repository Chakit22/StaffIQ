"use client";

import React from "react";
import Layout from "@/components/layout";
import CandidateComponent from "@/components/candidate";

export default function Candidate() {
  return (
    <div className="min-h-screen bg-background">
      <Layout>
        <CandidateComponent />
      </Layout>
    </div>
  );
}
