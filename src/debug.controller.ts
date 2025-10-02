import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';

function decodePayload(token?: string) {
  try {
    if (!token) return null;
    const [, payload] = token.split('.');
    const json = Buffer.from(payload, 'base64').toString('utf8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

@Controller('debug')
export class DebugController {
  @Get('echo-auth')
  echoAuth(@Req() req: Request) {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : undefined;
    const payload = decodePayload(token);

    return {
      ok: true,
      hasAuthHeader: !!auth,
      authHeaderPreview: auth ? `${auth.slice(0, 20)}... (len ${auth.length})` : '(none)',
      tokenPresent: !!token,
      tokenLen: token?.length ?? 0,
      payloadAud: payload?.aud ?? null,
      payloadExp: payload?.exp ?? null,
      payloadIss: payload?.iss ?? null,
      note: 'No signature verification on this route (debug only).',
    };
  }
}
