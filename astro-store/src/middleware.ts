import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.url.pathname.startsWith('/api/auth')) {
    return next();
  }

  if (context.url.pathname.startsWith('/auth')) {
    return next();
  }

  const sessionId = context.cookies.get('session')?.value;

  if (!sessionId) {
    return context.redirect('/auth/login');
  }

  return next();
});