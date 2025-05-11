"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Applicant } from "../types/ApplicantType";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

export default function ViewDetailsDialog({
  applicant,
}: {
  applicant: Applicant;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View Details</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{`${applicant.firstname} ${applicant.lastname}`}</DialogTitle>
        <DialogDescription>
          {`${applicant.email} • ${
            applicant.role.charAt(0).toUpperCase() + applicant.role.slice(1)
          } • ${
            applicant.availability.charAt(0).toUpperCase() +
            applicant.availability.slice(1)
          }`}
        </DialogDescription>
        <div className="flex justify-center items-center p-4 h-full">
          <Tabs defaultValue="skills" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="academic_creds">
                Academic Credentials
              </TabsTrigger>
            </TabsList>
            <TabsContent value="skills">
              <Textarea value={applicant.skills} />
            </TabsContent>
            <TabsContent value="academic_creds">
              <Textarea value={applicant.availability} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
