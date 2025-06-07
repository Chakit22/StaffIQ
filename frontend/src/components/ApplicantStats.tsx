"use client"; //Marks this component to run on the client side in a Next.js app

//Importing chart components from Recharts

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

//Importing the Applicant type to ensure correct props
import { Applicant } from "@/types/ApplicationType";

//Props type: this component receives a list of applicants
interface Props {
  applicants: Applicant[];
}

//Main component that displays a bar chart of applicant stats
export default function ApplicantStats({ applicants }: Props) {
  //Remove duplicate applicants based on their ID and role
  const uniqueApplicants = Object.values(
    applicants.reduce((acc, applicant) => {
      const key = `${applicant.id}-${applicant.role.toLowerCase()}`; //Create a unique key per role + ID
      if (!acc[key]) {
        acc[key] = applicant; //Only keep first occurrence of each unique key
      }
      return acc;
    }, {} as Record<string, Applicant>) //Initial value is an empty object
  );

  //Format data for the bar chart
  const data = uniqueApplicants.map((a) => ({
    name: `${a.firstname?.toUpperCase()} ${a.lastname?.toUpperCase()} (${a.role.toUpperCase()})`, //Display name in uppercase with role
    selections: 1, //Each applicant gets one bar with value 1 (can be updated if needed)
  }));

  return (
    <div className="p-6 bg-white border rounded-lg shadow">
      {/*Title*/}
      <h2 className="text-xl font-semibold mb-4">
        📊 Applicant Selection Stats
      </h2>

      {/*Show message if no applicants are available*/}
      {data.length === 0 ? (
        <p>No applicants to visualize.</p>
      ) : (
        //Responsive chart container
        <ResponsiveContainer width="100%" height={300}>
          {/*Vertical bar chart*/}
          <BarChart
            data={data} //Pass the formatted data
            layout="vertical" //Bars go from left to right
            margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
          >
            {/*X-axis shows selection count*/}
            <XAxis type="number" />

            {/*Y-axis shows applicant names*/}
            <YAxis dataKey="name" type="category" width={200} />

            {/*Tooltip on hover*/}
            <Tooltip />

            {/*Bar for each applicant*/}
            <Bar dataKey="selections" fill="#3b82f6">
              {/*Show number next to each bar*/}
              <LabelList dataKey="selections" position="right" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
