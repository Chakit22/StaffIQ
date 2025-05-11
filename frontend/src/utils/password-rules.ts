import { PasswordRuleType } from "@/types/PasswordRuleType";

export const passwordRules: PasswordRuleType[] = [
  {
    label: "Minimum 8 characters",
    validate: (password: string) => password.length >= 8,
  },
  {
    label: "One Uppercase letter",
    validate: (password: string) => /[A-Z]/.test(password),
  },
  {
    label: "One Lowercase letter",
    validate: (password: string) => /[a-z]/.test(password),
  },
  {
    label: "One number",
    validate: (password: string) => /[0-9]/.test(password),
  },
  {
    label: "One special character",
    validate: (password: string) => /[^A-Za-z0-9]/.test(password),
  },
];
