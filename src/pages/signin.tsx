"use client";
import { useAuth } from "@/context/UserProvider";
import { useState } from "react";
import { LoginFormType } from "@/types/LoginFormType";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import PasswordRules from "@/components/password-rules";
import { passwordRules } from "@/utils/password-rules";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PasswordRuleType } from "@/types/PasswordRuleType";

export default function SignInForm() {
  const { user, login } = useAuth();
  const [showPassword, setshowPassword] = useState<boolean>(true);
  const [isPasswordFocused, setIsPasswordFocused] = useState<boolean>(false);
  const [formData, setFormData] = useState<LoginFormType>({
    email: "",
    password: "",
  });
  const router = useRouter();

  const setValue = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const allPasswordRulesMet = passwordRules.every((rule: PasswordRuleType) =>
      rule.validate(formData.password)
    );

    if (!allPasswordRulesMet) {
      return;
    }

    const areCredsValid = login(formData.email, formData.password);

    if (areCredsValid) {
      toast.success("User Logged in Sucessfully!");
      router.replace(`/${user?.role}`);
    } else {
      toast.error("Invalid Username or password!");
      setValue("email", "");
      setValue("password", "");
    }
  };

  return (
    <div className="w-screen min-h-screen flex justify-center items-center">
      <Card className="p-6 py-8 rounded-lg shadow-2xl w-2xs md:w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col justify-center gap-4"
            onSubmit={handleSubmit}
          >
            {/* Email */}
            <div className="flex flex-col gap-2 justify-center">
              <Label htmlFor="email" className="text-bold text-md">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                onChange={(e) => setValue("email", e.target.value)}
                className="placeholder:text-md"
                value={formData.email}
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2 justify-center">
              <Label htmlFor="password" className="text-bold text-md">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "password" : "text"}
                  placeholder="Password"
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  className="placeholder:text-md"
                  onChange={(e) => setValue("password", e.target.value)}
                  value={formData.password}
                  required
                />
                <div onClick={() => setshowPassword(!showPassword)}>
                  {showPassword ? (
                    <FaEye className="absolute top-1/2 transform -translate-y-1/2 right-3" />
                  ) : (
                    <FaEyeSlash className="absolute top-1/2 transform -translate-y-1/2 right-3" />
                  )}
                </div>
              </div>
              {/* Password Rules */}
              {(isPasswordFocused || formData.password) && (
                <PasswordRules password={formData.password} />
              )}
            </div>

            {/* Login Button */}
            <Button type="submit" className="w-full rounded-sm text-md">
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col justify-center">
          <div className="text-md">
            New User ?{" "}
            <span>
              <Link href={"/signup"} className="text-blue-400">
                Register
              </Link>
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
