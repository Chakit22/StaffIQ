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
import LoaderComponent from "@/components/Loading";

export default function SignInForm() {
  const { user, login, userLoading } = useAuth();
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
    if (!userLoading) {
      if (!user) router.replace("/signin");
      else router.replace(`/${user.role}`);
    }
  }, [user, router, userLoading]);

  if (userLoading) {
    return <LoaderComponent />;
  }

  return (
    <div className="min-h-screen flex justify-center items-center relative">
      <Card className="rounded-lg shadow-2xl w-2xs md:w-md px-6">
        <div className="text-center text-2xl font-bold">Login</div>
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
          <Button type="submit" className="rounded-sm text-md">
            Login
          </Button>
        </form>
        <div className="flex justify-center items-center gap-2">
          New User?{" "}
          <span>
            <Link href={"/signup"} className="text-blue-400">
              Register
            </Link>
          </span>
        </div>
      </Card>
    </div>
  );
}
