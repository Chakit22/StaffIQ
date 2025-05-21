
// "use client";

// import { useForm } from "react-hook-form";
// import { useState } from "react";
// import { register as registerUser } from "@/services/auth";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import PasswordRules from "@/components/password-rules";
// import { passwordRules } from "@/utils/password-rules";
// import { FaEye, FaEyeSlash } from "react-icons/fa";

// const avatarUrls = [
//   "https://mighty.tools/mockmind-api/content/human/65.jpg",
//   "https://mighty.tools/mockmind-api/content/human/115.jpg",
//   "https://mighty.tools/mockmind-api/content/human/120.jpg",
//   "https://mighty.tools/mockmind-api/content/human/127.jpg",
//   "https://mighty.tools/mockmind-api/content/human/123.jpg",
//   "https://mighty.tools/mockmind-api/content/cartoon/27.jpg",
//   "https://mighty.tools/mockmind-api/content/cartoon/26.jpg",
//   "https://mighty.tools/mockmind-api/content/cartoon/31.jpg",
//   "https://mighty.tools/mockmind-api/content/cartoon/7.jpg",
//   "https://mighty.tools/mockmind-api/content/abstract/51.jpg",
//   "https://mighty.tools/mockmind-api/content/abstract/38.jpg",
//   "https://mighty.tools/mockmind-api/content/abstract/35.jpg",
//   "https://mighty.tools/mockmind-api/content/abstract/32.jpg",
// ];

// type SignUpFormType = {
//   name: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   role: string;
//   avatarUrl?: string;
// };

// export default function SignUpForm() {
//   const [isPasswordFocused, setIsPasswordFocused] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm<SignUpFormType>();

//   const onSubmit = async (data: SignUpFormType) => {
//     const res = await registerUser(data);

//     if (res.success) {
//       toast.success("Registration successful!");
//       router.replace("/signin");
//     } else {
//       toast.error(res.message || "Registration failed.");
//     }
//   };

//   const handleAvatarSelect = (url: string) => {
//     setSelectedAvatar(url);
//     setValue("avatarUrl", url);
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center">
//       <Card className="min-w-[350px] md:min-w-[500px] p-6 shadow-xl">
//         <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           {/* Name */}
//           <div>
//             <Label htmlFor="name">Name</Label>
//             <Input
//               id="name"
//               placeholder="Your name"
//               {...register("name", { required: "Name is required" })}
//             />
//             {errors.name && (
//               <p className="text-red-500 text-sm">{errors.name.message}</p>
//             )}
//           </div>

//           {/* Role Dropdown */}
//           <div>
//             <Label htmlFor="role">Register as</Label>
//             <select
//               id="role"
//               {...register("role", { required: "Role is required" })}
//               className="w-full border border-gray-300 p-2 rounded"
//             >
//               <option value="">Select role</option>
//               <option value="candidate">Candidate</option>
//               <option value="lecturer">Lecturer</option>
//             </select>
//             {errors.role && (
//               <p className="text-red-500 text-sm">{errors.role.message}</p>
//             )}
//           </div>

//           {/* Avatar Selection */}
//           <div>
//             <Label>Choose an Avatar</Label>
//             <div className="grid grid-cols-4 gap-2 mt-2">
//               {avatarUrls.map((url) => (
//                 <div
//                   key={url}
//                   className={`cursor-pointer border-2 rounded-full p-1 transition ${selectedAvatar === url ? "border-blue-500" : "border-transparent"}`}
//                   onClick={() => handleAvatarSelect(url)}
//                 >
//                   <img
//                     src={url}
//                     alt="avatar"
//                     className="w-16 h-16 rounded-full"
//                   />
//                 </div>
//               ))}
//             </div>
//             {selectedAvatar && (
//               <p className="text-green-600 text-sm mt-1">Avatar selected ✔</p>
//             )}
//             <input type="hidden" {...register("avatarUrl")} />
//           </div>

//           {/* Email */}
//           <div>
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="you@example.com"
//               {...register("email", { required: "Email is required" })}
//             />
//             {errors.email && (
//               <p className="text-red-500 text-sm">{errors.email.message}</p>
//             )}
//           </div>

//           {/* Password */}
//           <div>
//             <Label htmlFor="password">Password</Label>
//             <div className="relative">
//               <Input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Create a strong password"
//                 {...register("password", {
//                   required: "Password is required",
//                   validate: (value) =>
//                     passwordRules.every((rule) => rule.validate(value)) ||
//                     "Password does not meet requirements",
//                 })}
//                 onFocus={() => setIsPasswordFocused(true)}
//                 onBlur={() => setIsPasswordFocused(false)}
//               />
//               <div
//                 onClick={() => setShowPassword((prev) => !prev)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </div>
//             </div>
//             {(isPasswordFocused || watch("password")) && (
//               <PasswordRules password={watch("password")} />
//             )}
//             {errors.password && (
//               <p className="text-red-500 text-sm">{errors.password.message}</p>
//             )}
//           </div>

//           {/* Confirm Password */}
//           <div>
//             <Label htmlFor="confirmPassword">Confirm Password</Label>
//             <div className="relative">
//               <Input
//                 id="confirmPassword"
//                 type={showConfirmPassword ? "text" : "password"}
//                 placeholder="Re-enter password"
//                 {...register("confirmPassword", {
//                   required: "Please confirm your password",
//                   validate: (value) =>
//                     value === watch("password") || "Passwords do not match",
//                 })}
//               />
//               <div
//                 onClick={() => setShowConfirmPassword((prev) => !prev)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
//               >
//                 {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//               </div>
//             </div>
//             {errors.confirmPassword && (
//               <p className="text-red-500 text-sm">
//                 {errors.confirmPassword.message}
//               </p>
//             )}
//           </div>

//           <Button type="submit" className="w-full">
//             Register
//           </Button>
//         </form>

//         <div className="text-sm text-center mt-4">
//           Already have an account?{" "}
//           <a href="/signin" className="text-blue-500 underline">
//             Sign In
//           </a>
//         </div>
//       </Card>
//     </div>
//   );
// }


// "use client";

// import { useForm } from "react-hook-form";
// import { useState } from "react";
// import { register as registerUser } from "@/services/auth";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import PasswordRules from "@/components/password-rules";
// import { passwordRules } from "@/utils/password-rules";

// type SignUpFormType = {
//   name: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   role: string;
// };

// export default function SignUpForm() {
//   const [isPasswordFocused, setIsPasswordFocused] = useState(false);
//   const router = useRouter();

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm<SignUpFormType>();

//   const onSubmit = async (data: SignUpFormType) => {
//     const res = await registerUser(data);

//     if (res.success) {
//       toast.success("Registration successful!");
//       router.replace("/signin");
//     } else {
//       toast.error(res.message || "Registration failed.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center">
//       <Card className="min-w-[350px] md:min-w-[500px] p-6 shadow-xl">
//         <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//           {/* Name */}
//           <div>
//             <Label htmlFor="name">Name</Label>
//             <Input
//               id="name"
//               placeholder="Your name"
//               {...register("name", { required: "Name is required" })}
//             />
//             {errors.name && (
//               <p className="text-red-500 text-sm">{errors.name.message}</p>
//             )}
//           </div>

//           {/* Role Dropdown */}
//           <div>
//             <Label htmlFor="role">Register as</Label>
//             <select
//               id="role"
//               {...register("role", { required: "Role is required" })}
//               className="w-full border border-gray-300 p-2 rounded"
//             >
//               <option value="">Select role</option>
//               <option value="candidate">Candidate</option>
//               <option value="lecturer">Lecturer</option>
//             </select>
//             {errors.role && (
//               <p className="text-red-500 text-sm">{errors.role.message}</p>
//             )}
//           </div>

//           {/* Email */}
//           <div>
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               type="email"
//               placeholder="you@example.com"
//               {...register("email", { required: "Email is required" })}
//             />
//             {errors.email && (
//               <p className="text-red-500 text-sm">{errors.email.message}</p>
//             )}
//           </div>

//           {/* Password */}
//           <div>
//             <Label htmlFor="password">Password</Label>
//             <Input
//               id="password"
//               type="password"
//               placeholder="Create a strong password"
//               {...register("password", {
//                 required: "Password is required",
//                 validate: (value) =>
//                   passwordRules.every((rule) => rule.validate(value)) ||
//                   "Password does not meet requirements",
//               })}
//               onFocus={() => setIsPasswordFocused(true)}
//               onBlur={() => setIsPasswordFocused(false)}
//             />
//             {(isPasswordFocused || watch("password")) && (
//               <PasswordRules password={watch("password")} />
//             )}
//             {errors.password && (
//               <p className="text-red-500 text-sm">{errors.password.message}</p>
//             )}
//           </div>

//           {/* Confirm Password */}
//           <div>
//             <Label htmlFor="confirmPassword">Confirm Password</Label>
//             <Input
//               id="confirmPassword"
//               type="password"
//               placeholder="Re-enter password"
//               {...register("confirmPassword", {
//                 required: "Please confirm your password",
//                 validate: (value) =>
//                   value === watch("password") || "Passwords do not match",
//               })}
//             />
//             {errors.confirmPassword && (
//               <p className="text-red-500 text-sm">
//                 {errors.confirmPassword.message}
//               </p>
//             )}
//           </div>

//           <Button type="submit" className="w-full">
//             Register
//           </Button>
//         </form>

//         <div className="text-sm text-center mt-4">
//           Already have an account?{" "}
//           <a href="/signin" className="text-blue-500 underline">
//             Sign In
//           </a>
//         </div>
//       </Card>
//     </div>
//   );
// }


"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { register as registerUser } from "@/services/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import PasswordRules from "@/components/password-rules";
import { passwordRules } from "@/utils/password-rules";

type SignUpFormType = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
};

export default function SignUpForm() {
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormType>();

  const onSubmit = async (data: SignUpFormType) => {
    const res = await registerUser(data);

    if (res.success) {
      toast.success("Registration successful!");
      router.replace("/signin");
    } else {
      toast.error(res.message || "Registration failed.");
    }
  };

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

          {/* Role */}
          <div>
            <Label htmlFor="role">Register as</Label>
            <select
              id="role"
              {...register("role", { required: "Role is required" })}
              className="w-full border border-gray-300 p-2 rounded"
            >
              <option value="">Select role</option>
              <option value="candidate">Candidate</option>
              <option value="lecturer">Lecturer</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm">{errors.role.message}</p>
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

          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>

        <div className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/signin" className="text-blue-500 underline">
            Sign In
          </a>
        </div>
      </Card>
    </div>
  );
}
