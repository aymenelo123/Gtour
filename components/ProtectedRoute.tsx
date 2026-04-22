"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground text-lg font-medium animate-pulse">جاري التحميل...</p>
      </div>
    );
  }

  // If we are not loading, and there's no user, the useEffect will redirect.
  // We return null to prevent a flash of content before redirect kicks in.
  if (!user) {
    return null;
  }

  return <>{children}</>;
}
