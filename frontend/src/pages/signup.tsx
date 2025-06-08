import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordRules from "@/components/password-rules";
import { passwordRules } from "@/utils/password-rules";
import { UserRegistrationInput } from "@/types/User";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useRole from "@/hooks/useRole";
import { Role } from "@/types/Role";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import LoaderComponent from "@/components/Loading";
import { useAuthContext } from "@/context/UserProvider";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { getAllRoles } = useRole();
  const [roles, setRoles] = useState<Role[]>([]);
  const { registerUser } = useAuth();
  const { loading, user } = useAuthContext();
  const router = useRouter();

  //This will run on every render as getAllRoles will add a new reference everytime when this component is rendered
  useEffect(() => {
    const fetchRoles = async () => {
      const roles = await getAllRoles();
      setRoles(roles);
    };
    fetchRoles();
  }, [getAllRoles]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
  } = useForm<UserRegistrationInput & { confirmPassword: string }>();

  const onSubmit = async (data: UserRegistrationInput) => {
    try {
      await registerUser(data);
      toast.success("User registered successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to register user");
    }
  };

  // Show loading overlay while loading
  if (loading) {
    return <LoaderComponent />;
  }

  // Redirect to home page if user is already registered
  if (user) {
    // redirect to home page
    router.replace(`/${user.role}`);
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="min-w-[350px] md:min-w-[500px] p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Your name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              placeholder="Your phone number"
              {...register("phone", { required: "Phone is required" })}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              {...register("password", {
                required: "Password is required",
                validate: (value) =>
                  passwordRules.every((rule) => rule.validate(value)) ||
                  "Password does not meet requirements",
              })}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
            />
            <button
              type="button"
              className="absolute top-9 right-3 text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {(isPasswordFocused || watch("password")) && (
              <PasswordRules password={watch("password")} />
            )}
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
            />
            <button
              type="button"
              className="absolute top-9 right-3 text-gray-500"
              onClick={() => setShowConfirm((prev) => !prev)}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Role selection dropdown */}
          <FormField
            control={control}
            name="role"
            rules={{ required: "Please select a role" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="min-w-1/3">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>

        <div className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link href="/signin" className="text-blue-500 underline">
            Sign In
          </Link>
        </div>
      </Card>
    </div>
  );
}
