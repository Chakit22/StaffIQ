"use client";
import Navbar from "./navbar";
import Footer from "./footer";
import { ApplicantProvider } from "../context/ApplicantProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ApplicantProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow p-6">{children}</main>
        <Footer />
      </div>
    </ApplicantProvider>
  );
}
