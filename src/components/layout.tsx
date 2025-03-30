"use client";

import Navbar from "./navbar";
import Footer from "./footer";
import { ApplicantProvider } from "@/context/ApplicantProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ApplicantProvider>
      <Navbar></Navbar>
      <main className="p-6">{children}</main>
      <Footer></Footer>
    </ApplicantProvider>
  );
}
