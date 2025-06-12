"use client";

import { useAuth } from "@/context/UserProvider";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/services/auth";
import { toast } from "sonner";

const avatarOptions = [
  "https://mighty.tools/mockmind-api/content/human/65.jpg",
  "https://mighty.tools/mockmind-api/content/human/115.jpg",
  "https://mighty.tools/mockmind-api/content/human/120.jpg",
  "https://mighty.tools/mockmind-api/content/human/127.jpg",
  "https://mighty.tools/mockmind-api/content/human/123.jpg",
  "https://mighty.tools/mockmind-api/content/cartoon/27.jpg",
  "https://mighty.tools/mockmind-api/content/cartoon/26.jpg",
  "https://mighty.tools/mockmind-api/content/cartoon/31.jpg",
  "https://mighty.tools/mockmind-api/content/cartoon/7.jpg",
  "https://mighty.tools/mockmind-api/content/abstract/51.jpg",
  "https://mighty.tools/mockmind-api/content/abstract/38.jpg",
  "https://mighty.tools/mockmind-api/content/abstract/35.jpg",
  "https://mighty.tools/mockmind-api/content/abstract/32.jpg",
];

export default function ProfilePage() {
  const { user, userLoading } = useAuth();
  const router = useRouter();
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userLoading && !user) {
      router.replace("/signin");
    } else if (user) {
      // Use avatar.url if available, fall back to avatarUrl for backward compatibility
      setSelectedAvatar(user.avatar?.url || user.avatarUrl || "");
      setEmail(user.email);
    }
  }, [user, userLoading, router]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const res = await updateProfile({
      id: user.id,
      email,
      avatarUrl: selectedAvatar || "",
    });
    setSaving(false);
    if (res.success) {
      toast.success("Profile updated successfully");
      localStorage.setItem("currentUser", JSON.stringify(res.user));
      location.reload();
    } else {
      toast.error(res.message || "Update failed");
    }
  };

  if (userLoading || !user) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  // Current avatar URL - either from avatar object or legacy avatarUrl
  const currentAvatarUrl = user.avatar?.url || user.avatarUrl || "";

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <Card className="w-full max-w-md p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>

        {currentAvatarUrl && (
          <div className="flex justify-center">
            <img
              src={currentAvatarUrl}
              alt="Avatar"
              className="w-24 h-24 rounded-full mb-4"
            />
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label className="font-medium">Name:</Label>
            <p className="text-gray-700">{user.name}</p>
          </div>
          <div>
            <Label className="font-medium">Email:</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1"
            />
          </div>
          <div>
            <Label className="font-medium">Role:</Label>
            <p className="capitalize text-gray-700">{user.role}</p>
          </div>
          <div>
            <Label className="font-medium">Date of Joining:</Label>
            <p className="text-gray-700">
              {user.dateOfJoining
                ? new Date(user.dateOfJoining).toLocaleDateString()
                : "Not available"}
            </p>
          </div>

          {user.role === "candidate" && (
            <div>
              <Label className="font-medium">Select Avatar:</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {avatarOptions.map((url) => (
                  <div
                    key={url}
                    className={`cursor-pointer border-2 rounded-full p-1 transition ${
                      selectedAvatar === url
                        ? "border-blue-500"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedAvatar(url)}
                  >
                    <img
                      src={url}
                      alt="avatar"
                      className="w-16 h-16 rounded-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
