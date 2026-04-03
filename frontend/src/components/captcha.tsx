"use client";

import ReCAPTCHA from "react-google-recaptcha";

interface CaptchaProps {
  onChange: (token: string | null) => void;
}

export default function Captcha({ onChange }: CaptchaProps) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  if (!siteKey) {
    console.error("Missing NEXT_PUBLIC_RECAPTCHA_SITE_KEY");
    return null;
  }

  return (
    <ReCAPTCHA
      sitekey={siteKey}
      onChange={onChange}
    />
  );
}
