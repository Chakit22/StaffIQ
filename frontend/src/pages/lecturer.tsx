"use client";

import React from "react";
import Layout from "@/components/layout";
import LecturerComponent from "@/components/lecturer";

export default function LecturerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Layout>
        <LecturerComponent />
      </Layout>
    </div>
  );
}
