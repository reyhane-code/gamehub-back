import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class HttpSecurityHeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    //TODO: fix dynamicaly for files
    // X-Content-Type-Options - Prevents MIME-sniffing, ensuring the browser respects the declared content type
    // res.setHeader("X-Content-Type-Options", "nosniff");

    // // X-Frame-Options - Protects against Clickjacking by controlling whether the page can be displayed in a frame
    // res.setHeader("X-Frame-Options", "DENY");

    // // X-XSS-Protection - Enables the browser's built-in XSS protection
    // res.setHeader("X-XSS-Protection", "1; mode=block");

    // // Access-Control-Allow-Origin - Specifies which origins are allowed to access resources on the server
    // res.setHeader("Access-Control-Allow-Origin", "https://example.com");

    // // Content-Disposition - Controls how content is displayed in the browser (e.g., forcing downloads)
    // // res.setHeader("Content-Disposition", 'attachment; filename="filename.pdf"');

    // // Cache-Control - Controls how and for how long the browser caches content
    // res.setHeader("Cache-Control", "no-store");

    // // Permissions-Policy - Controls which features can be used in the browser
    // res.setHeader("Permissions-Policy", "geolocation=(self), microphone=(), camera=(self)");

    next(); // Proceed to the next middleware or route handler
  }
}