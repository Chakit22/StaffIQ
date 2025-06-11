import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
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
import { RegisterUserSchema } from "@/schemas/auth/register.schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { registerUser } = useAuth();
  const { loading, user } = useAuthContext();
  console.log("user", user);
  const router = useRouter();

  const form = useForm<RegisterUserSchema>({
    resolver: zodResolver(RegisterUserSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = form;

  const onSubmit = async (data: RegisterUserSchema) => {
    const response = await registerUser(data);
    if (response.success) {
      toast.success(response.message);
      // Redirect to login page
      router.replace("/signin");
    } else {
      toast.error(response.message);
    }
  };

  // Show loading overlay while loading
  if (loading) {
    return <LoaderComponent />;
  }

  // Redirect to home page if user is already registered
  if (user) {
    // redirect to appropriate page based on user role
    router.replace(`/${user.role}?id=${user.id}`);
    return;
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="min-w-[350px] md:min-w-[500px] p-6 shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" {...register("name")} />
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
                {...register("email")}
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
                type="text"
                placeholder="Your phone number"
                {...register("phone")}
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
                {...register("password")}
              />
              <button
                type="button"
                className="absolute top-9 right-3 text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Role selection dropdown */}
            <FormField
              control={control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="min-w-1/3">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {["candidate", "lecturer"].map((role, index) => (
                          <SelectItem key={index} value={role}>
                            {role}
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
        </Form>
      </Card>
    </div>
  );
}
