export interface PasswordRuleType {
  label: string;
  validate: (password: string) => boolean;
}
