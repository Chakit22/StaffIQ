"use client";

import { PasswordRuleType } from "@/types/PasswordRuleType";
import { passwordRules } from "@/utils/password-rules";
import { Check, X } from "lucide-react";

export default function PasswordRules({ password }: { password: string }) {
  return (
    <div className="bg-muted p-4 border border-border rounded-sm mt-4">
      <ul>
        {passwordRules.map((rule: PasswordRuleType, i) => {
          const isPwdValid = rule.validate(password);
          return (
            <li key={i} className="flex items-center gap-2">
              {isPwdValid ? (
                <Check size={16} className="text-green-400" />
              ) : (
                <X size={16} className="text-red-400" />
              )}
              <span className={isPwdValid ? "text-green-400" : "text-muted-foreground"}>
                {rule.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
