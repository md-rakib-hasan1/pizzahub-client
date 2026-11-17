
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut, UserRound } from "lucide-react";

const AccountPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Logout failed.");
        return;
      }

      toast.success("You have logged out successfully.");
      router.replace("/login");
      router.refresh();
    } catch {
      toast.error("Something went wrong during logout.");
    } finally {
      setLoggingOut(false);
    }
  };

  if (isPending || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F1E7]">
        <Loader2 className="size-8 animate-spin text-[#D94B35]" />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F1E7] px-4 py-12">
      <Card className="w-full max-w-lg rounded-3xl">
        <CardHeader className="items-center text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-[#D94B35]/10">
            <UserRound className="size-8 text-[#D94B35]" />
          </div>

          <CardTitle className="font-heading text-2xl">
            Welcome, {session.user.name}!
          </CardTitle>

          <CardDescription>
            Your PizzaHub account session is active.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-xl bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              Full name
            </p>
            <p className="font-medium">
              {session.user.name}
            </p>
          </div>

          <div className="rounded-xl bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              Email address
            </p>
            <p className="font-medium">
              {session.user.email}
            </p>
          </div>

          <Button
            onClick={handleLogout}
            disabled={loggingOut}
            variant="destructive"
            className="w-full"
          >
            {loggingOut ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="mr-2 size-4" />
                Logout
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default AccountPage;
