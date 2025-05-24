export const jwtConfig = {
  secret: process.env.JWT_SECRET || "your-super-secret-key",
  accessTokenExpiration: "15m", // 15 minutes
  refreshTokenExpiration: "7d", // 7 days
};
