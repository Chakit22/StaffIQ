"use client";

import { PasswordRuleType } from "@/types/PasswordRuleType";
import { passwordRules } from "@/utils/password-rules";
import { Check, X } from "lucide-react";

export default function PasswordRules({ password }: { password: string }) {
  return (
    <div className="w-full bg-gray-200 p-4 border-2 rounded-sm">
      <ul>
        {passwordRules.map((rule: PasswordRuleType, i) => {
          const isPwdValid = rule.validate(password);
          return (
            <li key={i} className="flex items-center gap-2">
              {isPwdValid ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <X size={16} className="text-red-500" />
              )}
              <span className={isPwdValid ? "text-green-500" : "text-gray-600"}>
                {rule.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
