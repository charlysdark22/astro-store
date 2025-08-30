import type { APIRoute } from 'astro';
import { db } from '../../../lib/database';
import bcrypt from 'bcrypt';

export const post: APIRoute = async (context) => {
  const form = await context.request.formData();
  const email = form.get('email');
  const password = form.get('password');

  if (typeof email !== 'string' || typeof password !== 'string') {
    return new Response('Email and password are required', { status: 400 });
  }

  const user = await db.users.findUnique({
    where: { email },
  });

  if (!user) {
    return new Response('Invalid credentials', { status: 401 });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return new Response('Invalid credentials', { status: 401 });
  }

  context.cookies.set('session', user.id, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return context.redirect('/');
};