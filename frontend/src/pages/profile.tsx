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
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

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
    return <p className="text-center mt-10 text-muted-foreground">Loading...</p>;
  }

  const currentAvatarUrl = user.avatar?.url || user.avatarUrl || "";

  return (
    <div className="min-h-screen flex justify-center items-center bg-background">
      <motion.div variants={fadeInUp} initial="initial" animate="animate">
        <Card className="w-full max-w-md p-6 shadow-xl border-border bg-card/80 backdrop-blur-xl">
          <h2 className="text-2xl font-bold mb-4 text-center text-foreground">Profile</h2>

          {currentAvatarUrl && (
            <div className="flex justify-center">
              <img
                src={currentAvatarUrl}
                alt="Avatar"
                className="w-24 h-24 rounded-full mb-4 ring-2 ring-primary/40"
              />
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label className="font-medium text-muted-foreground">Name:</Label>
              <p className="text-foreground">{user.name}</p>
            </div>
            <div>
              <Label className="font-medium text-muted-foreground">Email:</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Label className="font-medium text-muted-foreground">Role:</Label>
              <p className="capitalize text-foreground">{user.role}</p>
            </div>
            <div>
              <Label className="font-medium text-muted-foreground">Date of Joining:</Label>
              <p className="text-foreground">
                {user.dateOfJoining
                  ? new Date(user.dateOfJoining).toLocaleDateString()
                  : "Not available"}
              </p>
            </div>

            {user.role === "candidate" && (
              <div>
                <Label className="font-medium text-muted-foreground">Select Avatar:</Label>
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-4 gap-2 mt-2"
                >
                  {avatarOptions.map((url) => (
                    <motion.div
                      key={url}
                      variants={staggerItem}
                      className={`cursor-pointer border-2 rounded-full p-1 transition ${
                        selectedAvatar === url
                          ? "border-primary glow-purple-sm"
                          : "border-transparent hover:border-primary/30"
                      }`}
                      onClick={() => setSelectedAvatar(url)}
                    >
                      <img
                        src={url}
                        alt="avatar"
                        className="w-16 h-16 rounded-full"
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}

            <div className="flex justify-end mt-4">
              <Button onClick={handleSave} disabled={saving} className="glow-purple-sm">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
