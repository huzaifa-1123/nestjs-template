import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

export const traceIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // 1. Determine Trace ID: Priority to incoming header, then pino's req.id, then new UUID
  const traceId = (req.headers['x-trace-id'] as string) || (req as any).id || uuidv4();

  // 2. Attach to Request for logging/internal use
  (req as any).id = traceId;
  req.headers['x-trace-id'] = traceId;

  // 3. Attach to Response Header immediately
  // This ensures the header is present even if an Exception is thrown later
  res.setHeader('x-trace-id', traceId);

  next();
};
