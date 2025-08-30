import type { APIRoute } from 'astro';

export const get: APIRoute = async (context) => {
  context.cookies.delete('session', { path: '/' });
  return context.redirect('/auth/login');
};