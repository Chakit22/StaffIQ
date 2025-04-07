"use client";
import { useAuth } from "@/context/UserProvider";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import Captcha from "@/components/captcha";

export default function SignInForm() {
  const { user, login } = useAuth();
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [isPasswordFocused, setIsPasswordFocused] = useState<boolean>(false);
  const router = useRouter();
  const [isVerified, setIsVerified] = useState<boolean>(false);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormType>();

  const onSubmit = (data: LoginFormType) => {
    if (!isVerified) {
      toast.error(
        "User is not verified as a human. Please verify and then try again!"
      );
      return;
    }

    const isValidUser = login(data.email, data.password);
    if (!isValidUser) {
      toast.error("Invalid Username or Password!");
    }
  };

  useEffect(() => {
    console.log("useeffect!");
    // Navigate only when the user updates
    if (user?.role) {
      toast.success("User Logged in Successfully!");
      router.push(`/${user?.role}`);
    }
  }, [user]);

  return (
    <div className="w-screen min-h-screen flex justify-center items-center">
      <Card className="p-6 py-8 rounded-lg shadow-2xl w-2xs md:w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col justify-center gap-4"
            onSubmit={handleSubmit(onSubmit)}
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
                className="placeholder:text-md"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <span className="text-red-500">{errors.email.message}</span>
              )}
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
                  className="placeholder:text-md"
                  {...register("password", {
                    required: "Password is required",
                    validate: (value) =>
                      passwordRules.every((rule) => rule.validate(value)) ||
                      "Password does not meet the requirements",
                  })}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                />
                <div onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <FaEye className="absolute top-1/2 transform -translate-y-1/2 right-3" />
                  ) : (
                    <FaEyeSlash className="absolute top-1/2 transform -translate-y-1/2 right-3" />
                  )}
                </div>
              </div>

              {/* Password Rules */}
              {(isPasswordFocused || watch("password")) && (
                <PasswordRules password={watch("password")} />
              )}

              {errors.password && (
                <span className="text-red-500">{errors.password.message}</span>
              )}
            </div>

            {/* Captcha Verification */}
            {!isVerified && <Captcha setIsVerified={setIsVerified} />}

            {/* Login Button */}
            <Button type="submit" className="w-full rounded-sm text-md">
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col justify-center">
          <div className="text-md">
            New User?{" "}
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
