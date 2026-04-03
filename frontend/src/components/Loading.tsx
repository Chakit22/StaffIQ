"use client";

import SyncLoader from "react-spinners/SyncLoader";

export default function LoaderComponent() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <SyncLoader size={32} color="#8b5cf6" />
    </div>
  );
}
