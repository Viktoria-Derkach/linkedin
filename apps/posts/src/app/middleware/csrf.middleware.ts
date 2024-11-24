import { Injectable, NestMiddleware } from '@nestjs/common';
import { doubleCsrf } from 'csrf-csrf';
import { NextFunction, Request, Response } from 'express';

const {
  doubleCsrfProtection, // Middleware to validate the CSRF token
  generateToken, // Function to generate a new CSRF token
} = doubleCsrf({
  getSecret: (req: Request) => {
    return req.cookies['csrf-secret'];
  }, // Retrieves secret from cookies
  cookieName: 'csrf-secret', // Name of the cookie that stores the secret
  cookieOptions: {
    // httpOnly: true,
    // secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'strict',
  },
  size: 64, // Secret size (default 64 bytes)
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'], // Methods to ignore for CSRF checks
});

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.cookies || !req.cookies['csrf-secret']) {
      res.cookie('csrf-secret', generateToken(req, res));
    }
    next();
  }
}

export { doubleCsrfProtection };
