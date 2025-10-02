// src/auth/jwt.strategy.ts
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as jwksRsa from "jwks-rsa";
import type { Request } from "express";

type JwtPayload = {
  iss: string;
  aud: string | string[];
  sub: string;
  exp: number;
  nbf?: number;
  iat?: number;
  scope?: string;
  scp?: string;
  email?: string;
  upn?: string;
  preferred_username?: string;
};

// Custom extractor that logs what comes in
const loggingExtractor = (req: Request) => {
  const auth = req.headers?.authorization || "";
  console.log("AUTH HEADER:", auth ? `${auth.slice(0, 20)}... (len ${auth.length})` : "(none)");
  const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req) || "";
  console.log("TOKEN EXTRACTED:", token ? `len ${token.length}` : "(none)");
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor() {
    console.log("AUD_EXPECTED:", process.env.OIDC_AUDIENCE);

    super({
      jwtFromRequest: loggingExtractor, // use our extractor
      algorithms: ["RS256"],
      // don't enforce issuer/audience here; we'll log/check in validate()
      ignoreExpiration: false,
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        jwksUri: process.env.JWKS_URI!, // https://login.microsoftonline.com/<tenant>/discovery/v2.0/keys
        cache: true,
        cacheMaxEntries: 5,
        cacheMaxAge: 10 * 60 * 1000,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
      }) as any,
    });
  }

  // <-- THIS is the validate() method (inside the class, not a txt file)
  async validate(payload: JwtPayload) {
    console.log("AUD_IN_TOKEN:", payload.aud);

    const expected = process.env.OIDC_AUDIENCE;
    const aud = Array.isArray(payload.aud) ? payload.aud[0] : payload.aud;

    if (expected && aud !== expected) {
      throw new Error(`Invalid audience: got ${aud}, expected ${expected}`);
    }

    const email =
      payload.email ||
      payload.preferred_username ||
      payload.upn ||
      undefined;

    return {
      sub: payload.sub,
      scope: (payload.scp || payload.scope || "") as string,
      email,
      iss: payload.iss,
      aud,
    };
  }
}
