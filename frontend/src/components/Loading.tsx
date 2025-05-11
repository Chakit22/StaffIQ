"use client";

import SyncLoader from "react-spinners/SyncLoader";

export default function LoaderComponent() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <SyncLoader size={32} color="oklch(0.623 0.214 259.815)" />
    </div>
  );
}
