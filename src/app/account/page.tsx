
"use client";

import { useState } from "react";
import Image from "next/image";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  LogOut,
  UserRound,
  Save,
  Mail,
  ShieldCheck,
  Camera,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface AccountUser {
  name: string;
  email: string;
  image?: string | null;
  role?: string;
}

const AccountSettings = ({ user }: { user: AccountUser }) => {
  const router = useRouter();

  const [name, setName] = useState(user.name || "");
  const [profileImage, setProfileImage] = useState(user.image || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleProfileUpdate = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (trimmedName.length < 2 || trimmedName.length > 50) {
      toast.error("Name must contain 2 to 50 characters.");
      return;
    }

    if (trimmedName === user.name) {
      toast.info("No changes to save.");
      return;
    }

    setSaving(true);

    try {
      const { error } = await authClient.updateUser({
        name: trimmedName,
      });

      if (error) {
        toast.error(error.message || "Profile update failed.");
        return;
      }

      toast.success("Profile updated successfully.");
      router.refresh();
    } catch {
      toast.error("Something went wrong while updating your profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first.");
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(selectedFile.type)) {
      toast.error("Only JPG, PNG, and WEBP images are allowed.");
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("Image size cannot exceed 5MB.");
      return;
    }

    setUploading(true);

    try {
      const tokenResponse = await fetch("/api/auth/token");

      if (!tokenResponse.ok) {
        throw new Error("Unable to authenticate your request.");
      }

      const tokenData = await tokenResponse.json();

      if (!tokenData.token) {
        throw new Error("Authentication token not found.");
      }

      const formData = new FormData();
      formData.append("image", selectedFile);

      const uploadResponse = await fetch(`${API_URL}/api/images/profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: formData,
      });

      const result = await uploadResponse.json();

      if (!uploadResponse.ok || !result.success) {
        throw new Error(result.message || "Image upload failed.");
      }

      const imageUrl = result.data.imageUrl;

      const { error } = await authClient.updateUser({
        image: imageUrl,
      });

      if (error) {
        throw new Error(error.message || "Unable to save profile image.");
      }

      setProfileImage(imageUrl);
      setSelectedFile(null);

      toast.success("Profile image updated successfully.");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while uploading the image."
      );
    } finally {
      setUploading(false);
    }
  };

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

  return (
    <main className="min-h-screen bg-[#F8F1E7] px-4 py-16">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D94B35]">
            My Account
          </p>

          <h1 className="mt-3 font-heading text-3xl font-bold text-[#29231F] sm:text-4xl">
            Profile Settings
          </h1>

          <p className="mt-3 text-muted-foreground">
            Manage your PizzaHub account information.
          </p>
        </div>

        <Card className="rounded-3xl border-[#29231F]/10 shadow-sm">
          <CardHeader className="items-center text-center">
            <div className="relative size-24 overflow-hidden rounded-full border-4 border-[#D94B35]/15 bg-[#D94B35]/10">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt="Profile picture"
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <UserRound className="size-12 text-[#D94B35]" />
                </div>
              )}
            </div>

            <CardTitle className="font-heading text-2xl">
              Welcome, {user.name}!
            </CardTitle>

            <CardDescription>
              Update your profile information.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-7">
            <div className="space-y-3">
              <Label htmlFor="profile-image">Profile Picture</Label>

              <Input
                id="profile-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) =>
                  setSelectedFile(event.target.files?.[0] || null)
                }
              />

              <p className="text-xs text-muted-foreground">
                JPG, PNG or WEBP. Maximum size 5MB.
              </p>

              {selectedFile && (
                <p className="break-all text-sm text-muted-foreground">
                  Selected: {selectedFile.name}
                </p>
              )}

              <Button
                type="button"
                onClick={handleImageUpload}
                disabled={!selectedFile || uploading}
                className="w-full bg-[#71836A] text-white hover:bg-[#5D7057]"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Camera className="mr-2 size-4" />
                    Upload Profile Picture
                  </>
                )}
              </Button>
            </div>

            <div className="border-t" />

            <form onSubmit={handleProfileUpdate} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  minLength={2}
                  maxLength={50}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Email Address</Label>
                <div className="flex items-center gap-3 rounded-lg border bg-muted/50 px-3 py-2.5">
                  <Mail className="size-4 text-muted-foreground" />
                  <span className="break-all text-sm">{user.email}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Email address cannot be changed from this page.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Account Role</Label>
                <div className="flex items-center gap-3 rounded-lg border bg-muted/50 px-3 py-2.5">
                  <ShieldCheck className="size-4 text-[#71836A]" />
                  <span className="text-sm font-medium capitalize">
                    {user.role || "customer"}
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={saving || name.trim() === user.name}
                className="w-full bg-[#D94B35] text-white hover:bg-[#BD3D2B]"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 size-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </form>

            <div className="border-t pt-5">
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
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

const AccountPage = () => {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  if (!isPending && !session) {
    router.replace("/login");
  }

  if (isPending || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8F1E7]">
        <Loader2 className="size-8 animate-spin text-[#D94B35]" />
      </main>
    );
  }

  return (
    <AccountSettings user={session.user as AccountUser} />
  );
};

export default AccountPage;
