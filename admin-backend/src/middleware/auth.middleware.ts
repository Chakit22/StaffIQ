import { MiddlewareFn } from "type-graphql";
import { GraphQLError } from "graphql";
import { AdminRole } from "../entities/Admin";
import { AuthService } from "../services/auth.service";
import { Request, Response, NextFunction } from "express";

export interface Context {
  token?: string;
  admin?: any;
}

export const AuthMiddleware: MiddlewareFn<Context> = async (
  { context },
  next
) => {
  if (!context.token) {
    throw new GraphQLError("Not authenticated");
  }

  const authService = new AuthService();
  try {
    context.admin = await authService.validateToken(context.token);
    return next();
  } catch (error) {
    throw new GraphQLError("Not authenticated");
  }
};

export function Roles(roles: AdminRole[]) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const context = args[2];
      if (!roles.includes(context.admin.role)) {
        throw new GraphQLError("Not authorized");
      }

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

interface AuthenticatedRequest extends Request {
  user?: any;
}

export class AuthMiddlewareClass {
  private authService = new AuthService();

  authenticateToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: "Access token required" });
    }

    try {
      const decoded = this.authService.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
  };

  // GraphQL context creation
  createContext = ({ req }: { req: AuthenticatedRequest }) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      try {
        const user = this.authService.verifyToken(token);
        return { user };
      } catch (error) {
        return {};
      }
    }

    return {};
  };
}
