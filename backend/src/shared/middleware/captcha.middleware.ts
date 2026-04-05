import { Request, Response, NextFunction } from "express";

export async function verifyCaptcha(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  // Skip CAPTCHA in test/dev mode
  if (process.env.SKIP_CAPTCHA === "true") {
    delete req.body.captchaToken;
    next();
    return;
  }

  const { captchaToken } = req.body;

  if (!captchaToken) {
    res.status(400).json({
      success: false,
      message: "CAPTCHA token is required.",
    });
    return;
  }

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    if (!secretKey) {
      console.error("Missing RECAPTCHA_SECRET_KEY environment variable");
      res.status(500).json({
        success: false,
        message: "Server configuration error.",
      });
      return;
    }

    const params = new URLSearchParams({
      secret: secretKey,
      response: captchaToken,
    });

    const response = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      },
    );

    const data = await response.json();

    if (!data.success) {
      res.status(400).json({
        success: false,
        message: "CAPTCHA verification failed. Please try again.",
      });
      return;
    }

    // Remove captchaToken from body so it doesn't interfere with schema validation downstream
    delete req.body.captchaToken;

    next();
  } catch (error) {
    console.error("CAPTCHA verification error:", error);
    res.status(500).json({
      success: false,
      message: "CAPTCHA verification failed.",
    });
  }
}
