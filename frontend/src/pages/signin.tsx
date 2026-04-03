import { useAuthContext } from "@/context/UserProvider";
import useAuth from "@/hooks/useAuth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Captcha from "@/components/captcha";
import LoaderComponent from "@/components/Loading";
import { LoginUserSchema } from "@/schemas/auth/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const router = useRouter();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const { loading, user } = useAuthContext();
  const { loginUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginUserSchema>({
    resolver: zodResolver(LoginUserSchema),
  });

  // Async login with backend API
  const onSubmit = async (data: LoginUserSchema) => {
    if (!captchaToken) {
      toast.error("Please complete CAPTCHA before logging in.");
      return;
    }

    const response = await loginUser(data, captchaToken);
    if (response.success) {
      toast.success(response.message);
      // router.replace(`/${user.role}?id=${user.id}`);
    } else {
      toast.error(response.message);
    }
  };

  // Show loading overlay while loading
  if (loading) {
    return <LoaderComponent />;
  }

  // Redirect to home page if user is already logged in
  if (user) {
    // redirect to appropriate page based on user role
    router.replace(`/${user.role}?id=${user.id}`);
    return;
  }

  return (
    <div className="min-h-screen flex justify-center items-center relative">
      <Card className="rounded-lg shadow-2xl min-w-2xs md:min-w-md px-6">
        <div className="text-center text-2xl font-bold">Login</div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div>
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
          <div>
            <Label htmlFor="password" className="text-bold text-md">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "password" : "text"}
                placeholder="Password"
                className="placeholder:text-md"
                {...register("password")}
              />
              <div onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <FaEye className="absolute top-1/2 transform -translate-y-1/2 right-3" />
                ) : (
                  <FaEyeSlash className="absolute top-1/2 transform -translate-y-1/2 right-3" />
                )}
              </div>
            </div>

            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
          </div>

          {/* Captcha */}
          <Captcha onChange={setCaptchaToken} />

          {/* Submit */}
          <Button type="submit" className="rounded-sm text-md">
            Login
          </Button>
        </form>

        <div className="flex justify-center items-center gap-2 mt-4">
          New User?{" "}
          <Link href={"/signup"} className="text-blue-400">
            Register
          </Link>
        </div>
      </Card>
    </div>
  );
}
