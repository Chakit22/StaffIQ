import { Spinner } from "./spinner";

interface LoadingOverlayProps {
  text?: string;
  fullScreen?: boolean;
}

export function LoadingOverlay({
  text,
  fullScreen = false,
}: LoadingOverlayProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-background/80 z-50 ${
        fullScreen ? "fixed inset-0" : "absolute inset-0"
      }`}
    >
      <Spinner size="lg" className="mb-4" />
      {text && <p className="text-lg font-medium">{text}</p>}
    </div>
  );
}
