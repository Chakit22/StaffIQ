import jwt, { SignOptions } from "jsonwebtoken";
import { jwtConfig } from "../config/jwt.config";

interface JWTPayload {
  userId: string;
  email?: string;
  role?: string;
}

export class AuthService {
  generateAccessToken(userId: string, email: string, role: string) {
    const payload: JWTPayload = { userId, email, role };
    const signOptions: SignOptions = {
      expiresIn:
        jwtConfig.accessTokenExpiration as jwt.SignOptions["expiresIn"],
    };
    return jwt.sign(payload, jwtConfig.secret, signOptions);
  }

  generateRefreshToken(userId: string) {
    const payload: JWTPayload = { userId };
    const signOptions: SignOptions = {
      expiresIn:
        jwtConfig.refreshTokenExpiration as jwt.SignOptions["expiresIn"],
    };
    return jwt.sign(payload, jwtConfig.secret, signOptions);
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, jwtConfig.secret) as JWTPayload;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  async validateToken(token: string): Promise<JWTPayload> {
    try {
      return jwt.verify(token, jwtConfig.secret) as JWTPayload;
    } catch (error) {
      throw new Error("Invalid token");
    }
  }

  refreshAccessToken(refreshToken: string) {
    try {
      const decoded = this.verifyToken(refreshToken);
      // You would typically look up the user in the database here
      // and verify that the refresh token is still valid
      return this.generateAccessToken(decoded.userId, "", ""); // Add proper user data
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }
}
