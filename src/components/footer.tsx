"use client";
import Link from "next/link";
import { Github, Mail, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-2 border-blue-100 bg-blue-50">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">TeachTeam</h3>
            <p className="text-foreground text-sm">
              A comprehensive platform for managing tutor applications and
              selections efficiently.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-foreground hover:text-blue-800 text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/tutors"
                  className="text-foreground hover:text-blue-800 text-sm"
                >
                  Tutor Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/lecturers"
                  className="text-foreground hover:text-blue-800 text-sm"
                >
                  Lecturer Portal
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-foreground hover:text-blue-800 text-sm"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-foreground hover:text-blue-800 text-sm"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-foreground hover:text-blue-800 text-sm"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Connect</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-foreground hover:text-blue-800">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-foreground hover:text-blue-800">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-foreground hover:text-blue-800">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-blue-100">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-foreground text-sm">
              © {new Date().getFullYear()} Tutor Management System. All rights
              reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="#"
                className="text-foreground hover:text-blue-800 text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-foreground hover:text-blue-800 text-sm"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
