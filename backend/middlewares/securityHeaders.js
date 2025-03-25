// middlewares/securityHeaders.js
export const securityHeaders = (req, res, next) => {
    res.set({
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Content-Security-Policy': "default-src 'self'",
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    });
    next();
  };
  
  // server.js
  app.use(securityHeaders);