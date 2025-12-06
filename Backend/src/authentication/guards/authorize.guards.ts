import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
@Injectable()
export class authorizeGuards implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    // Get token from Authorization header
    const authHeader = request.headers['authorization'] as string | undefined;

    if (!authHeader) {
      console.log("Authorization header missing");
      throw new UnauthorizedException("Authorization header missing");
    }

    const token = authHeader.split(' ')[1]?.trim();

    if (!token) {
      console.log("Bearer token missing or malformed");
      throw new UnauthorizedException("Bearer token missing or malformed");
    }

    try {
      // Verify token
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'mySuperSecretKey123!',
        algorithms: ['HS256'], // Ensure algorithm matches the one used during signing
      });

      // Attach payload to request for later use
      (request as any).user = payload;
      console.log("Token verified successfully:", payload);

      return true;
    } catch (err) {
      console.log("Token verification failed:", err.message);
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
