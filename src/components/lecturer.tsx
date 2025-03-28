"use client";

import Layout from "./layout";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export default function LecturerComponent() {
  return (
    <Layout>
      <Card className="m-12">
        <CardHeader className="bg-blue-500">
          <CardTitle className="text-white">Select Course</CardTitle>
          <CardDescription>
            View and manage tutor applications for a specific course
          </CardDescription>
        </CardHeader>
      </Card>
    </Layout>
  );
}
